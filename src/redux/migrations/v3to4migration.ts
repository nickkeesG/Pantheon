import type { PersistedState } from "redux-persist";
import type { IdeaState } from "../ideaSlice";
import type { Idea } from "../models";
import type { RootState } from "../store";

interface V3Idea extends Idea {
	textTokens: string[];
	tokenSurprisals: number[];
}

interface V3IdeaState {
	ideas: { [id: number]: V3Idea };
}

export type V3StoreState = {
	[P in keyof Omit<RootState, "idea">]: RootState[P];
} & {
	idea: V3IdeaState;
} & PersistedState;

export const V3to4Migration = (state: PersistedState): RootState => {
	if (state && "idea" in state) {
		const ideaState = state.idea as V3IdeaState;
		const newIdeas: Idea[] = Object.values(ideaState.ideas).map(
			({ textTokens, tokenSurprisals, ...idea }) => ({
				...idea,
			}),
		);
		const newIdeaState: IdeaState = {
			ideas: newIdeas.reduce(
				(acc, idea) => {
					acc[idea.id] = idea;
					return acc;
				},
				{} as { [id: number]: Idea },
			),
		};
		return {
			...state,
			idea: newIdeaState,
		} as RootState;
	}

	return state as RootState;
};
