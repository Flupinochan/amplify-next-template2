import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/userSlice";
import historyReducer from "./features/historySlice";
import loadingChatReducer from "./features/loadingChatSlice";
import selectedIdReducer from "./features/selectedIdSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    history: historyReducer,
    loadingChat: loadingChatReducer,
    selectedId: selectedIdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;