import { configureStore, applyMiddleware, compose } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import { loadersSlice } from "./reducer/loadersSlice";
import wishlistReducer from './reducer/wishlistSlice'
import userReducer from "./reducer/userSlice";
import productCategoryReducer from "./reducer/productSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        user: userReducer,
        categories: productCategoryReducer,
        wishlist: wishlistReducer,
    },
}, composeEnhancers());

export default store;
