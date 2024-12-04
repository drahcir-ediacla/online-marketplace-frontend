import { configureStore, applyMiddleware, compose } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import { loadersSlice } from "./reducer/loadersSlice";
import wishlistReducer from './reducer/wishlistSlice'
import userReducer from "./reducer/userSlice";
import forumCategoriesReducer from "./reducer/forumCategoriesSlice"
import productCategoryReducer from "./reducer/productSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        user: userReducer,
        categories: productCategoryReducer,
        forumcategories: forumCategoriesReducer,
        wishlist: wishlistReducer,
    },
}, composeEnhancers());

export default store;
