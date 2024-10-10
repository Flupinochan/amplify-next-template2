import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Schema } from "@/amplify/data/resource";

interface MessagesState {
  history: Array<Schema["ChatHistory"]["type"]>;
}

const initialState: MessagesState = {
  history: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<Array<Schema["ChatHistory"]["type"]>>) => {
      console.log(action.payload);
      state.history.push(...action.payload);
    },
    clearHistory: (state) => {
      state.history.splice(0, state.history.length);
    },
  },
});

export const { setHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;