import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setError } = userSlice.actions;
export default userSlice.reducer;
