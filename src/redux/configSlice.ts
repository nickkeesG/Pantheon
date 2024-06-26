import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark'
}

export interface ConfigState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
  isSynchronizerActive: boolean; // TODO Remove this field
  theme?: Theme;
}

const initialState: ConfigState = {
  openAIKey: '',
  openAIOrgId: '',
  baseModel: 'davinci-002',
  chatModel: 'gpt-4o',
  isSynchronizerActive: false,
  theme: Theme.System
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
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    replaceSlice: (_, action: PayloadAction<ConfigState>) => action.payload,
    resetSlice: (_) => initialState
  },
});

export const { updateBaseModel, updateChatModel, setOpenaiKey, setOpenaiOrgId, setSynchronizerActive, setTheme, replaceSlice: replaceConfigSlice, resetSlice: resetConfigSlice } = configSlice.actions;
export const initialConfigState = initialState;
export default configSlice.reducer;