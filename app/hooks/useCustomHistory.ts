import { useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { Amplify } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import { setHistory, clearHistory } from "@/app/features/historySlice";
import { RootState } from "@/app/store";

Amplify.configure(outputs);
const client = generateClient<Schema>();

// Emailでフィルタリングしたチャット履歴をサブスクライブ
export const useCustomHistory = () => {
  const email = useSelector((state: RootState) => state.user.email);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!email) return;
    const subscription = client.models.ChatHistory.observeQuery({
      filter: { email: { eq: email } },
    }).subscribe({
      next: (data) => {
        console.log("subscribe");
        console.log(data.items);
        dispatch(setHistory(data.items));
      },
    });
    return () => subscription.unsubscribe();
  }, [email, dispatch]);
};