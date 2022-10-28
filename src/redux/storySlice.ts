import { createSlice } from "@reduxjs/toolkit";
import shortid from "shortid";

interface Message {
  id: string;
  message: string;
  sender: string;
}

interface Story {
  messages: Message[];
  storyId: string;
  isActive: Boolean;
}

const initialState: Story = {
  messages: [
    {
      id: "0",
      message: "Hello! Greetings",
      sender: "ai",
    },
  ],
  isActive: true,
  storyId: shortid.generate(),
};

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetStory: (state) => {
      state.messages = initialState.messages;
      state.storyId = shortid.generate();
    },
  },
});

export const { addMessage, resetStory } = storySlice.actions;
export default storySlice.reducer;
