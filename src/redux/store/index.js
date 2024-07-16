import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../reducers/todoReducers";
export default configureStore({
    reducer: {
        listTodo: todoReducer
    }
});
