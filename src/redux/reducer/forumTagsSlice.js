import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [], // This will hold the tags data
  error: null,
};

const forumTagsSlice = createSlice({
  name: 'forumtags',
  initialState,
  reducers: {
    setTags: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTags, setError } = forumTagsSlice.actions;
export default forumTagsSlice.reducer;
