import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OpenAIApi } from './apiModels';

export enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark'
}

export interface ConfigState {
  openAI: OpenAIApi
  theme?: Theme;
}

const initialState: ConfigState = {
  openAI: {
    ApiKey: '',
    OrgId: '',
    baseModel: 'davinci-002',
    chatModel: 'gpt-4o'
  },
  theme: Theme.System
};

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    updateOpenAIConfig(state, action: PayloadAction<Partial<OpenAIApi>>) {
      state.openAI = {
        ...state.openAI,
        ...action.payload
      };
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    replaceSlice: (_, action: PayloadAction<ConfigState>) => action.payload,
    resetSlice: (_) => initialState
  },
});

export const { updateOpenAIConfig, setTheme, replaceSlice: replaceConfigSlice, resetSlice: resetConfigSlice } = configSlice.actions;
export const initialConfigState = initialState;
export default configSlice.reducer;