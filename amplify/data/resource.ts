import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";
import { chatOpenAI } from "../functions/chatOpenAI/resource";

const schema = a.schema({
  ChatHistory: a
    .model({
      id: a.id().required(),
      email: a.email().required(),
      messages: a.string().array().required(),
      title: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),
  ChatOpenAI: a
    .query()
    .arguments({
      id: a.id().required(),
      email: a.email().required(),
      message: a.string().required(),
      title: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(chatOpenAI))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

// userPool(allow.authenticated())指定で認証したユーザのみGraphQLを利用可能にする
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});