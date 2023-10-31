import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [], // This will hold the category data
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCategories, setError } = categorySlice.actions;
export default categorySlice.reducer;
