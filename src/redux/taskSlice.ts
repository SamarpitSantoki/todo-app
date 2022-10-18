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
  filterdTaskList: Array<Task>;
}

const initialState: TaskState = {
  taskList: [
    {
      id: "1",
      subject: "Task 1",
      done: false,
    },
    {
      id: "2",
      subject: "Task 2",
      done: true,
    },
    {
      id: "3",
      subject: "Task 3",
      done: false,
    },
    {
      id: "4",
      subject: "Task 4",
      done: false,
    },
    {
      id: "5",
      subject: "Task 5",
      done: true,
    },
  ],
  filterdTaskList: [
    {
      id: "1",
      subject: "Task 1",
      done: false,
    },
    {
      id: "2",
      subject: "Task 2",
      done: true,
    },
    {
      id: "3",
      subject: "Task 3",
      done: false,
    },
    {
      id: "4",
      subject: "Task 4",
      done: false,
    },
    {
      id: "5",
      subject: "Task 5",
      done: true,
    },
  ],
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
      state.filterdTaskList = state.taskList;
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.taskList.findIndex(
        (task) => task.id === action.payload.id
      );
      state.taskList[index] = action.payload;
      const filterdIndex = state.filterdTaskList.findIndex(
        (task) => task.id === action.payload.id
      );
      state.filterdTaskList[filterdIndex] = action.payload;
    },
    toggleTaskState: (state, action: PayloadAction<string>) => {
      const index = state.taskList.findIndex(
        (task) => task.id === action.payload
      );
      state.taskList[index].done = !state.taskList[index].done;
      state.filterdTaskList = state.taskList;
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.taskList = state.taskList.filter(
        (task) => task.id !== action.payload
      );
      state.filterdTaskList = state.taskList;
    },
    filterTaskByStatus: (state, action: PayloadAction<string>) => {
      let status: any =
        action.payload === "active"
          ? false
          : action.payload === "completed"
          ? true
          : null;
      state.filterdTaskList = state.taskList.filter((task) => {
        if (status === null) return task;
        return task.done === status;
      });
    },
  },
});

export const {
  addTask,
  toggleTaskState,
  updateTask,
  filterTaskByStatus,
  syncWithLocalStorage,
  deleteTask,
} = taskSlice.actions;

export const selectTaskList = (state: RootState) => state.task.filterdTaskList;

export default taskSlice.reducer;
