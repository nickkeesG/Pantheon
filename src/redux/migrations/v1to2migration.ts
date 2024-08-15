import { PersistedState } from "redux-persist";
import { Idea, IdeaType } from "../models";
import { IdeaState } from "../ideaSlice";
import { V2StoreState } from "./v2to3migration";

interface V1Idea {
  id: number;
  isUser: boolean;
  sectionId: number;
  parentIdeaId: number | null;
  text: string;
  textTokens: string[];
  tokenSurprisals: number[];
}

interface V1IdeasState {
  ideas: { [id: number]: V1Idea };
}

export type V1StoreState = { [P in keyof Omit<V2StoreState, 'idea'>]: V2StoreState[P]; } & {
  idea: V1IdeasState;
} & PersistedState;

export const V1to2Migration = (state: PersistedState): V2StoreState => {
  if (state && 'idea' in state) {
    const ideaState = state.idea as V1IdeasState;
    const newIdeas: Idea[] = Object.values(ideaState.ideas).map(idea => ({
      id: idea.id,
      type: idea.isUser === false ? IdeaType.InstructionToAi : IdeaType.User,
      sectionId: idea.sectionId,
      parentIdeaId: idea.parentIdeaId,
      text: idea.text,
      textTokens: idea.textTokens,
      tokenSurprisals: idea.tokenSurprisals
    }))
    const newIdeaState: IdeaState = {
      ideas: newIdeas.reduce((acc, idea) => {
        acc[idea.id] = idea;
        return acc;
      }, {} as { [id: number]: Idea })
    }
    return {
      ...state,
      idea: newIdeaState
    } as V2StoreState
  }

  return state as V2StoreState
}

