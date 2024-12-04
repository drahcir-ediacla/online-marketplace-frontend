import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  error: null,
};

const forumCategoriesSlice = createSlice({
  name: 'forumcategories',
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

export const { setCategories, setError } = forumCategoriesSlice.actions;
export default forumCategoriesSlice.reducer;
