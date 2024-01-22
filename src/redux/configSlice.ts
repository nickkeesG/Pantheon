import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
  isSynchronizerActive: boolean;
}


const initialConfigState: ConfigState = {
  openAIKey: '',
  openAIOrgId: '',
  baseModel: 'davinci-002',
  chatModel: 'gpt-4-1106-preview',
  isSynchronizerActive: false
};
const configSlice = createSlice({
  name: 'config',
  initialState: initialConfigState,
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
    },
    setSynchronizerActive(state, action: PayloadAction<boolean>) {
      state.isSynchronizerActive = action.payload;
    },
    resetConfigSlice: (state) => initialState
  },
});

export const { updateBaseModel, updateChatModel, setOpenaiKey, setOpenaiOrgId, setSynchronizerActive, resetConfigSlice } = configSlice.actions;
export default configSlice.reducer;