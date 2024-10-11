"use client";

import React from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import TextareaAutosizeCustom from "../ui/TextareaAutosizeCustom";
import { useCustomHistory } from "@/app/hooks/useCustomHistory";
import useChat from "@/app/hooks/useChat";
import HistoryList from '@/app/ui/HistoryList';
import LoadingButton from '@mui/lab/LoadingButton';

Amplify.configure(outputs);

const Center: React.FC<{ selectedId: string }> = ({ selectedId }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loadingChat.loading);
  const history = useSelector((state: RootState) => state.history.history);
  const { textareaRef, handleKeyDown, chatOpenAI } = useChat(dispatch);
  const filteredHistory = history.filter(item => item.id === selectedId);
  useCustomHistory();

  return (
    <div className="w-1/2 flex flex-col items-center p-3 m-3 border-primary border-2">
      <div className="w-full overflow-y-auto flex-grow">
        <HistoryList history={filteredHistory} />
      </div>
      <div className="flex flex-row items-end w-full bg-gray-300 p-2 rounded-lg max-h-24">
        <TextareaAutosizeCustom ref={textareaRef} onKeyDown={handleKeyDown} />
        <LoadingButton onClick={chatOpenAI} variant="contained" size="small" loading={isLoading} className="h-10">
          {isLoading ? "Chat" : "Chat"}
        </LoadingButton>
      </div>
    </div>
  );
};

export default Center;