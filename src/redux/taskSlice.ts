import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
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
  loading: boolean;
}

const initialState: TaskState = {
  taskList: [],
  filterdTaskList: [],
  loading: false,
};

// Make a async function to get data from localStorage
export const syncWithLocalStorage = createAsyncThunk(
  "task/syncWithLocalStorage",
  async () => {
    const data = await AsyncStorage.getItem("taskList");
    if (data) {
      console.log("data", data);

      return JSON.parse(data);
    } else {
      return [];
    }
  }
);

export const saveToLocalStorage = createAsyncThunk(
  "task/saveToLocalStorage",
  async (taskList: Array<Task>) => {
    console.log("taskList", taskList);

    await AsyncStorage.setItem("taskList", JSON.stringify(taskList));
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    updateTaskList: (state, action: any) => {
      state.taskList = action.paylaod;
      state.filterdTaskList = action.payload;
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
      saveToLocalStorage(state.taskList);
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
  extraReducers(builder) {
    builder.addCase(syncWithLocalStorage.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(syncWithLocalStorage.fulfilled, (state, action) => {
      state.taskList = action.payload;
      state.filterdTaskList = action.payload;
      state.loading = false;
    });

    builder.addCase(syncWithLocalStorage.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  updateTaskList,
  addTask,
  toggleTaskState,
  updateTask,
  filterTaskByStatus,
  deleteTask,
} = taskSlice.actions;

export const selectTaskList = (state: RootState) => state.task.filterdTaskList;
export const GET_TASK_LIST = (state: RootState) => state.task.taskList;
export default taskSlice.reducer;
