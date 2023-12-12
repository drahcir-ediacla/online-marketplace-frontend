import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {}, // Change to an object to store count for each product
  reducers: {
    addToWishlist: (state, action) => {
      const productId = action.payload;
      // Initialize count to 1 if not present, otherwise increment
      state[productId] = (state[productId] || 0) + 1;
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      if (state[productId] > 0) {
        state[productId] -= 1;
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
