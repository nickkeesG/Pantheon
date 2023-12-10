import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LLMState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
}


const initialLLMState: LLMState = {
  openAIKey: localStorage.getItem('openAIKey') || '',
  openAIOrgId: localStorage.getItem('openAIOrgId') || '',
  baseModel: 'davinci-002',
  chatModel: 'gpt-4-1106-preview'
};
const llmSlice = createSlice({
  name: 'llm',
  initialState: initialLLMState,
  reducers: {
    setOpenaiKey(state, action: PayloadAction<string>) {
      localStorage.setItem('openAIKey', action.payload);
      state.openAIKey = action.payload;
    },
    setOpenaiOrgId(state, action: PayloadAction<string>) {
      localStorage.setItem('openAIOrgId', action.payload);
      state.openAIOrgId = action.payload;
    },
    updateBaseModel(state, action: PayloadAction<string>) {
      state.baseModel = action.payload;
    },
    updateChatModel(state, action: PayloadAction<string>) {
      state.chatModel = action.payload;
    }
  },
});

export const { updateBaseModel, updateChatModel, setOpenaiKey, setOpenaiOrgId } = llmSlice.actions;
export default llmSlice.reducer;