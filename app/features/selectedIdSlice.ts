import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Schema } from "@/amplify/data/resource";
import { RootState } from "@/app/store";

interface SelectedIdState {
  selectedId: string;
}

const initialState: SelectedIdState = {
  selectedId: '',
};

const selectedIdSlice = createSlice({
  name: 'selectedId',
  initialState,
  reducers: {
    setSelectedId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    clearSelectedId: (state) => {
      state.selectedId = '';
    },
  },
});

export const { setSelectedId, clearSelectedId } = selectedIdSlice.actions;
export default selectedIdSlice.reducer;