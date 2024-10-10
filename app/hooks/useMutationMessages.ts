import { useMutation } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { setHistory, clearHistory } from "../features/historySlice";

const client = generateClient<Schema>();

export const useMutationMessages = (dispatch: any) => {
  return useMutation(async (email: string) => {
    const { data: chatHistory, errors } = await client.models.ChatHistory.list({
      filter: { email: { eq: email } }
    });
    return chatHistory;
  }, {
    onSuccess: async (data) => {
      await dispatch(clearHistory());
      await dispatch(setHistory(data));
      console.log(`useMutationMessages: ${data}`);
    },
  });
};