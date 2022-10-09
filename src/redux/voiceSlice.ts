import { createSlice } from "@reduxjs/toolkit";

interface VoiceState {
  voice: string;
}

const initialState: VoiceState = {
  voice: "en-US",
};

export const voiceSlice = createSlice({
  name: "voice",
  initialState,
  reducers: {
    setVoice: (state, action) => {
      state.voice = action.payload;
    },
  },
});

export const { setVoice } = voiceSlice.actions;

export default voiceSlice.reducer;
