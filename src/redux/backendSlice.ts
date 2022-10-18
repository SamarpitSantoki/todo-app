import { createSlice } from "@reduxjs/toolkit";

interface BackendStaff {
  url: string;
}

const initialState: BackendStaff = {
  url: "https://e6bd-117-200-53-212.in.ngrok.io",
};

export const backendSlice = createSlice({
  name: "backend",
  initialState,
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
  },
});

export const { setUrl } = backendSlice.actions;

export default backendSlice.reducer;
