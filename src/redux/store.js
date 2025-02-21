import { configureStore, applyMiddleware, compose } from "@reduxjs/toolkit";
import thunk from 'redux-thunk';
import { loadersSlice } from "./reducer/loadersSlice";
import wishlistReducer from './reducer/wishlistSlice'
import userReducer from "./reducer/userSlice";
import forumCategoriesReducer from "./reducer/forumCategoriesSlice"
import productCategoryReducer from "./reducer/productCategoriesSlice";
import forumTagsReducer from "./reducer/forumTagsSlice";
import tokenReducer from "./reducer/tokenSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        user: userReducer,
        productcategories: productCategoryReducer,
        forumcategories: forumCategoriesReducer,
        forumtags: forumTagsReducer,
        wishlist: wishlistReducer,
        token: tokenReducer,
    },
}, composeEnhancers());

export default store;
