import { useRef } from "react";
import { useMutationChat } from "@/app/hooks/useMutationChat";
import { useMutationMessages } from "@/app/hooks/useMutationMessages";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { v4 as uuidv4 } from 'uuid';

const useChat = (dispatch: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const email = useSelector((state: RootState) => state.user.email);
  const mutationChat = useMutationChat(dispatch);
  const mutationMessages = useMutationMessages(dispatch);
  const selectedId = useSelector((state: RootState) => state.selectedId.selectedId);

  const chatOpenAI = async () => {
    const message = textareaRef.current?.value;
    if (!message || !email) return;
    textareaRef.current!.value = "";
    if (!selectedId) {
      const newId = uuidv4();
      await mutationChat.mutateAsync({ id: newId, email: email, message: message });
    } else {
      await mutationChat.mutateAsync({ id: selectedId, email: email, message: message });
    }
    await mutationMessages.mutateAsync(email);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await chatOpenAI();
    }
  };

  return { textareaRef, handleKeyDown, chatOpenAI };
};

export default useChat;