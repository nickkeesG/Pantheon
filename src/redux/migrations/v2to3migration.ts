import { PersistedState } from "redux-persist";
import { ConfigState, Theme } from "../configSlice";
import { RootState } from "../store";
import { OpenAIApi } from "../apiModels";

interface V2ConfigState {
  openAIKey: string;
  openAIOrgId: string;
  baseModel: string;
  chatModel: string;
  isSynchronizerActive: boolean;
  theme?: Theme;
}

export const initialV2ConfigState: V2ConfigState = {
  openAIKey: "",
  openAIOrgId: "",
  baseModel: "davinci-002",
  chatModel: "gpt-4o",
  isSynchronizerActive: false,
  theme: Theme.System
}

export type V2StoreState = { [P in keyof Omit<RootState, 'config'>]: RootState[P]; } & {
  config: V2ConfigState;
} & PersistedState;

export const V2to3Migration = (state: PersistedState): RootState => {
  if (state && 'config' in state) {
    const configState = state.config as V2ConfigState;
    const OpenAIApiConfig: OpenAIApi = {
      ApiKey: configState.openAIKey,
      OrgId: configState.openAIOrgId,
      chatModel: configState.chatModel,
      baseModel: configState.baseModel
    }
    const newConfigState: ConfigState = {
      openAI: OpenAIApiConfig,
      theme: configState.theme
    }
    return {
      ...state,
      config: newConfigState
    } as RootState
  }

  return state as RootState
}