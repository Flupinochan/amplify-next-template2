import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { setLoading } from "@/app/features/loadingChatSlice";

const client = generateClient<Schema>();

const useMutationChat = (dispatch: any) => {
  const queryClient = useQueryClient(); 
  const chatOpenAI = async (id: string, email: string, message: string): Promise<any> => {
    const response = await client.queries.ChatOpenAI({ 
      id: id,
      email: email,
      message: message,
    });
    return response;
  };
  return useMutation<unknown, unknown, { id: string; email: string; message: string }>({
    mutationFn: async (variables: { id: string; email: string; message: string }) => {
      const response = await chatOpenAI(variables.id, variables.email, variables.message);
      return response;
    },
    onMutate: async () => {
      await dispatch(setLoading(true));
    },
    onSettled: async () => {
      await dispatch(setLoading(false));
    },
  });
};

export default useMutationChat;