import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LLMState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
}


const initialLLMState: LLMState = {
  openAIKey: '',
  openAIOrgId: '',
  baseModel: 'davinci-002',
  chatModel: 'gpt-4-1106-preview'
};
const llmSlice = createSlice({
  name: 'llm',
  initialState: initialLLMState,
  reducers: {
    setOpenaiKey(state, action: PayloadAction<string>) {
      state.openAIKey = action.payload;
    },
    setOpenaiOrgId(state, action: PayloadAction<string>) {
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