import type { PersistedState } from "redux-persist";
import { Theme } from "../../styles/types/theme";
import type { OpenAIApi } from "../apiModels";
import type { ConfigState } from "../configSlice";
import type { V3StoreState } from "./v3to4migration";

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
	theme: Theme.System,
};

export type V2StoreState = {
	[P in keyof Omit<V3StoreState, "config">]: V3StoreState[P];
} & {
	config: V2ConfigState;
} & PersistedState;

export const V2to3Migration = (state: PersistedState): V3StoreState => {
	if (state && "config" in state) {
		const configState = state.config as V2ConfigState;
		const OpenAIApiConfig: OpenAIApi = {
			ApiKey: configState.openAIKey,
			OrgId: configState.openAIOrgId,
			chatModel: configState.chatModel,
			baseModel: configState.baseModel,
		};
		const newConfigState: ConfigState = {
			openAI: OpenAIApiConfig,
			theme: configState.theme,
		};
		return {
			...state,
			config: newConfigState,
		} as V3StoreState;
	}

	return state as V3StoreState;
};
