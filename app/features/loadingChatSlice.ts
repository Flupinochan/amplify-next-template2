import { createSlice } from "@reduxjs/toolkit";

export const loadingChatSlice = createSlice({
  name: "loadingChat",
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = loadingChatSlice.actions;
export default loadingChatSlice.reducer;