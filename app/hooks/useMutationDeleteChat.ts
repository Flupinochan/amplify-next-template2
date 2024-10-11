import { useMutation } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export const useMutationDeleteChat = () => {
  const deleteChat = async (id: string) => {
    await client.models.ChatHistory.delete({ id });
    await client.models.ChatHistory.list();
  };
  return useMutation({ mutationFn: deleteChat });
};