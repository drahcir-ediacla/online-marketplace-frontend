import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], // This will hold the category data
  error: null,
};

const productCategoriesSlice = createSlice({
  name: 'productcategories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCategories, setError } = productCategoriesSlice.actions;
export default productCategoriesSlice.reducer;
