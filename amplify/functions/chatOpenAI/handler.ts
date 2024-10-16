import type { Schema } from "../../data/resource";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { DynamoDBChatMessageHistory } from "@langchain/community/stores/message/dynamodb";
import { ChatOpenAI } from "@langchain/openai";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { CallbackHandler } from "langfuse-langchain";

// Environment
const DYNAMODB_TABLE_NAME = process.env.DYNAMODB_TABLE_NAME as string;
const config = {
  region: "us-west-2",
  maxAttempts: 30,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 900000,
    socketTimeout: 900000,
  }),
};

// Secrets Manager (APIKeyなどのシークレットを取得)
const secretClient = new SecretsManagerClient(config);
async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({
    SecretId: secretName,
  });
  const response = await secretClient.send(command);
  if (response.SecretString) {
    const secretJson = JSON.parse(response.SecretString);
    return secretJson[secretName];
  }
  throw new Error(`Secret ${secretName} not found or empty`);
}

// Langfuse
const langfuseSecretKey = await getSecret("langfusesecretkey");
const langfusePublicKey = await getSecret("langfusepublickey");
const langfuseCallbackHandler = new CallbackHandler({
  secretKey: langfuseSecretKey,
  publicKey: langfusePublicKey,
  baseUrl: "https://cloud.langfuse.com",
});

// LLM (OpenAI)
const openAIModelId = "gpt-4o-mini";
const openapiKey = await getSecret("openapikey");
const openapiOrg = await getSecret("openapiorg");
const openapiPj = await getSecret("openapipj");
const modelOpenAI = new ChatOpenAI({
  model: openAIModelId,
  configuration: {
    apiKey: openapiKey,
    organization: openapiOrg,
    project: openapiPj,
  },
  maxRetries: 3,
  maxTokens: 4000,
  callbacks: [langfuseCallbackHandler],
});

// LLM (Bedrock)
const bedrockModelId = "anthropic.claude-3-haiku-20240307-v1:0";
const bedrockRegion = "us-west-2";
const modelBedrock = new BedrockChat({
  model: bedrockModelId,
  region: bedrockRegion,
  timeout: 30000,
  maxRetries: 5,
  streaming: true,
  maxTokens: 4000,
  callbacks: [langfuseCallbackHandler],
});

// Prompt
const systemPrompt = SystemMessagePromptTemplate.fromTemplate("あなたは優秀な生成AIアシスタントです");
const humanPrompt = HumanMessagePromptTemplate.fromTemplate("{input}");
const chatHistory = new MessagesPlaceholder("chat_history");
const prompt = ChatPromptTemplate.fromMessages([
  systemPrompt,
  chatHistory,
  humanPrompt,
]);

// Parser
const parser = new StringOutputParser();

// Chain (ConversationChainは非推奨になった)
// const chain = new ConversationChain({
//   llm: model,
//   memory: memory,
//   outputParser: parser,
// });

// Memory (DynamoDB)
// チャットは、sessionID(partitionKey)で区別される
const memory = (sessionId: string) => {
  return new DynamoDBChatMessageHistory({
    tableName: DYNAMODB_TABLE_NAME,
    config: config,
    sessionId: sessionId,
    partitionKey: "id",
    messageAttributeName: "messages",
  });
};

// Chain
const chain = new RunnableWithMessageHistory({
  runnable: prompt.pipe(modelOpenAI).pipe(parser),
  inputMessagesKey: "input",
  outputMessagesKey: "output",
  historyMessagesKey: "chat_history",
  getMessageHistory: (sessionId: string) => {
    return memory(sessionId);
  },
});

// Emailキーを追加する関数
const dynamoDBClient = new DynamoDBClient(config);
async function addEmailAndTimestampToDynamoDB(sessionId: string, email: string) {
  const updateCommand = new UpdateItemCommand({
    TableName: DYNAMODB_TABLE_NAME,
    Key: {
      id: { S: sessionId },
    },
    UpdateExpression: "SET email = if_not_exists(email, :email), createdAt = if_not_exists(createdAt, :createdAt), updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":email": { S: email },
      ":createdAt": { S: new Date().toISOString() },
      ":updatedAt": { S: new Date().toISOString() },
    },
  });
  await dynamoDBClient.send(updateCommand);
}

// Entrypoint
export const handler: Schema["ChatOpenAI"]["functionHandler"] = async (event) => {
  const id = event.arguments.id as string;
  const email = event.arguments.email as string;
  const message = event.arguments.message as string;

  const input = {
    input: message,
  };
  const option = {
    configurable: {
      sessionId: id,
    }
  };

  const response = await chain.invoke(input, option);
  console.log(response);

  await addEmailAndTimestampToDynamoDB(id, email);
  return message;
};