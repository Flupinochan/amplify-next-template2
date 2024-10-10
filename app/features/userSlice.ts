import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string | null;
}

const initialState: UserState = {
  email: null,
};

const userSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = null;
    },
  },
});

export const { setEmail, clearEmail } = userSlice.actions;
export default userSlice.reducer;