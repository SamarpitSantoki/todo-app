import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../redux/taskSlice";
import backendReducer from "../redux/backendSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    backend: backendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
