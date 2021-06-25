import { configureStore } from "@reduxjs/toolkit";

const preloadedState = {
  todos: [],
};

export default configureStore({
  reducer: {},
  devTools: process.env.NODE_ENV !== "production",
  preloadedState,
});
