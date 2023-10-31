import { configureStore, compose } from "@reduxjs/toolkit";
import { loadersSlice } from "./reducer/loadersSlice";
import userReducer from "./reducer/userSlice";
import productCategoryReducer from "./reducer/productSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        user: userReducer,
        categories: productCategoryReducer,
    },
}, composeEnhancers());

export default store;
