import type { Schema } from "../../data/resource";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { DynamoDBChatMessageHistory } from "@langchain/community/stores/message/dynamodb";
import { ChatOpenAI } from "@langchain/openai";
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { ChatPromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DynamoDBClient, PutItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";

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
  try {
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });
    const response = await secretClient.send(command);
    if (response.SecretString) {
      const secretJson = JSON.parse(response.SecretString);
      return secretJson[secretName];
    }
    throw new Error(`Secret ${secretName} not found or empty`);
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error;
  }
}

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
  maxTokens: 1000,
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
  maxTokens: 1000,
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
  runnable: prompt.pipe(modelBedrock).pipe(parser),
  inputMessagesKey: "input",
  outputMessagesKey: "output",
  historyMessagesKey: "chat_history",
  getMessageHistory: (sessionId: string) => {
    return memory(sessionId);
  },
});

// Emailキーを追加する関数
const dynamoDBClient = new DynamoDBClient(config);
async function addEmailToDynamoDB(sessionId: string, email: string) {
  const getCommand = new GetItemCommand({
    TableName: DYNAMODB_TABLE_NAME,
    Key: {
      id: { S: sessionId },
    },
  });
  const existingItem = await dynamoDBClient.send(getCommand);
  if (!existingItem.Item || !existingItem.Item.email) {
    const putCommand = new PutItemCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Item: {
        id: { S: sessionId },
        email: { S: email },
      },
    });
    await dynamoDBClient.send(putCommand);
  }
}

// Entrypoint
export const handler: Schema["ChatOpenAI"]["functionHandler"] = async (event) => {
  const id = event.arguments.id as string;
  const email = event.arguments.email as string;
  const messages = event.arguments.messages as string;

  const input = {
    input: "私の名前を英語に翻訳してください",
  }
  const input2 = {
    input: "私の名前を覚えていますか",
  }
  const option = {
    configurable: {
      sessionId: id,
    },
  };

  const res1 = await chain.invoke(input, option);
  console.log(res1);
  const res2 = await chain.invoke(input2, option);
  console.log(res2);
  await addEmailToDynamoDB(id, email);
  return messages;
};