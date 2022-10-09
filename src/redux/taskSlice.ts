import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// implement localStorage for tasks

interface Task {
  id: string;
  subject: string;
  done: boolean;
}

interface TaskState {
  taskList: Array<Task>;
}

const initialState: TaskState = {
  taskList: [],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    syncWithLocalStorage: (state) => {
      AsyncStorage.getItem("taskList").then((value) => {
        if (value !== null) {
          state.taskList = JSON.parse(value);
        }
      });
    },

    addTask: (state, action: PayloadAction<Task>) => {
      state.taskList.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.taskList.findIndex(
        (task) => task.id === action.payload.id
      );
      state.taskList[index] = { ...action.payload };
      state.taskList[index] = action.payload;
    },
    toggleTaskState: (state, action: PayloadAction<string>) => {
      const index = state.taskList.findIndex(
        (task) => task.id === action.payload
      );
      state.taskList[index].done = !state.taskList[index].done;
    },
  },
});

export const { addTask, toggleTaskState, updateTask, syncWithLocalStorage } =
  taskSlice.actions;

export const selectTaskList = (state: RootState) => state.task.taskList;

export default taskSlice.reducer;
