import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface ConfigState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
  isSynchronizerVisible: boolean;
}

const initialState: ConfigState = {
  openAIKey: '',
  openAIOrgId: '',
  baseModel: 'davinci-002',
  chatModel: 'gpt-4-1106-preview',
  isSynchronizerVisible: false
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
    setSynchronizerVisible(state, action: PayloadAction<boolean>) {
      state.isSynchronizerVisible = action.payload;
    },
    resetConfigSlice: (state) => initialState
  },
});

export const { updateBaseModel, updateChatModel, setOpenaiKey, setOpenaiOrgId, setSynchronizerVisible, resetConfigSlice } = configSlice.actions;
export const initialConfigState = initialState;
export default configSlice.reducer;