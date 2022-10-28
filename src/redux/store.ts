import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";
import backendReducer from "./backendSlice";
import storyReducer from "./storySlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    backend: backendReducer,
    story: storyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
