"use client";

import React, { useRef, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Button } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useCustomHistory } from "@/app/hooks/useCustomHistory";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import TextareaAutosizeCustom from "../ui/TextareaAutosizeCustom";
import useMutationChat from "@/app/hooks/useMutationChat";
import { useMutationMessages } from "@/app/hooks/useMutationMessages";
import HistoryList from '@/app/ui/HistoryList';

Amplify.configure(outputs);
const client = generateClient<Schema>();

const Center: React.FC = () => {
  const dispatch = useDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = useSelector((state: RootState) => state.loadingChat.loading);
  const email = useSelector((state: RootState) => state.user.email);
  const history = useSelector((state: RootState) => state.history.history);
  useCustomHistory();

  // チャット送信
  const mutationChat = useMutationChat(dispatch);
  const mutationMessages = useMutationMessages(dispatch);
  async function chatOpenAI() {
    const message = textareaRef.current?.value;
    if (!message || !email) return;
    // mutateではなくmutateAsyncを使用する
    await mutationChat.mutateAsync({ id: uuidv4(), email: email, message: message });
    await mutationMessages.mutateAsync(email);
  }

  return (
    <div className="w-1/2 flex flex-col justify-center items-center p-3 m-3 border-primary border-2">
      <TextareaAutosizeCustom ref={textareaRef} />
      <div>{uuidv4()}</div>
      <Button onClick={chatOpenAI} variant="contained" disabled={isLoading}>
        {isLoading ? "Loading..." : "Chat OpenAI"}
      </Button>
      <div>
      <HistoryList history={history} />
      </div>
    </div>
  );
};

export default Center;
