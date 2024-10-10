import { defineFunction } from "@aws-amplify/backend";

export const chatOpenAI = defineFunction({
  name: "chatOpenAI",
  entry: "./handler.ts",
  timeoutSeconds: 30,
  memoryMB: 1024,
  environment: {
    DYNAMODB_TABLE_NAME: "ChatHistory-t3fnjhgacjdybhn6bcdst7fos4-NONE",
  },
});
