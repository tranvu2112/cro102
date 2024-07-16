import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    listTodo: []
}
const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo(state, action) {
            state.listTodo.push(action.payload);
        },

        deleteTodo(state, action) {
            state.listTodo = state.listTodo.filter(row => row.id !== action.payload);
        },
        updateTodo(state, action) {
            const { id, title } = action.payload;
            const todo = state.listTodo.find(row => row.id === id);
            if (todo) {
                todo.title = title;
            }
        },
        toggleTodoStatus(state, action) {
            const todo = state.listTodo.find(row => row.id === action.payload);
            if (todo) {
                todo.status = !todo.status;
            }
        },


    }
});
export const { addTodo, deleteTodo, updateTodo, toggleTodoStatus } = todoSlice.actions;
export default todoSlice.reducer;