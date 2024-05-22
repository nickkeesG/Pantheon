import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
  isSynchronizerActive: boolean;
}

const initialState: ConfigState = {
  openAIKey: '',
  openAIOrgId: '',
  baseModel: 'davinci-002',
  chatModel: 'gpt-4-1106-preview',
  isSynchronizerActive: false
};

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
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
    replaceSlice: (_, action: PayloadAction<ConfigState>) => action.payload,
    resetSlice: (state) => initialState
  },
});

export const { updateBaseModel, updateChatModel, setOpenaiKey, setOpenaiOrgId, setSynchronizerActive, replaceSlice: replaceConfigSlice, resetSlice: resetConfigSlice } = configSlice.actions;
export const initialConfigState = initialState;
export default configSlice.reducer;