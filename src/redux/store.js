import { configureStore, compose } from "@reduxjs/toolkit";
import { loadersSlice } from "./loadersSlice";
import userReducer from "./reducer/userSlice";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({
    reducer: {
        loaders: loadersSlice.reducer,
        user: userReducer,
    },
}, composeEnhancers());

export default store;
