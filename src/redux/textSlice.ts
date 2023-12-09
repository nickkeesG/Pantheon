import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface Idea {
  id: number;
  text: string;
}

export interface Comment {
  id: number;
  ideaId: number;
  text: string;
  daemonName: string;
  daemonType: string;
}

export interface TextState {
  openAIKey: string;
  openAIOrgId: string;
  lastTimeActive: number;
  ideas: Idea[];
  comments: Comment[];
}

const initialState: TextState = {
  openAIKey: localStorage.getItem('openAIKey') || '',
  openAIOrgId: localStorage.getItem('openAIOrgId') || '',
  lastTimeActive: Date.now(),
  ideas: [],
  comments: []
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setOpenaiKey(state, action: PayloadAction<string>) {
      localStorage.setItem('openAIKey', action.payload);
      state.openAIKey = action.payload;
    },
    setOpenaiOrgId(state, action: PayloadAction<string>) {
      localStorage.setItem('openAIOrgId', action.payload);
      state.openAIOrgId = action.payload;
    },
    setLastTimeActive(state) {
      state.lastTimeActive = Date.now();
    },
    addIdea(state, action: PayloadAction<string>) {
      const newId = state.ideas.length > 0 ? state.ideas[state.ideas.length - 1].id + 1 : 0;
      const newIdea: Idea = {
        id: newId,
        text: action.payload
      };
      state.ideas.push(newIdea);
    },
    addComment(state, action: PayloadAction<{ ideaId: number, text: string, daemonName: string, daemonType: string }>) {
      const newId = state.comments.length > 0 ? state.comments[state.comments.length - 1].id + 1 : 0;
      const newComment: Comment = {
        id: newId,
        ideaId: action.payload.ideaId,
        text: action.payload.text,
        daemonName: action.payload.daemonName,
        daemonType: action.payload.daemonType
      };
      state.comments.push(newComment);
    }
  },
});

export const selectCommentsForIdea = createSelector(
  [
    (state: RootState) => state.text.comments,
    (_: RootState, ideaId: number) => ideaId,
    (_: RootState, __: number, daemonType: string = '') => daemonType
  ],
  (comments, ideaId, daemonType) => comments.filter(comment => comment.ideaId === ideaId && (daemonType === '' || comment.daemonType === daemonType))
);

export const selectCommentsGroupedByIdeaIds = createSelector(
  [
    (state: RootState) => state.text.comments,
    (_: RootState, ideaIds: number[]) => ideaIds,
    (_: RootState, __: number[], daemonType: string = '') => daemonType
  ],
  (comments, ideaIds, daemonType) => {
    return ideaIds.reduce((acc, ideaId) => {
      acc[ideaId] = comments.filter(comment => comment.ideaId === ideaId && (daemonType === '' || comment.daemonType === daemonType));
      return acc;
    }, {} as Record<number, Comment[]>);
  }
);

export const selectRecentIdeasWithoutComments = createSelector(
  [(state: RootState) => state.text.ideas, (state: RootState) => state.text.comments],
  (ideas, comments) => {
    const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
    const maxIdeaIdWithComment = Math.max(...Array.from(ideaIdsWithComments));
    return ideas.filter(idea => !ideaIdsWithComments.has(idea.id) && idea.id > maxIdeaIdWithComment);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: RootState) => state.text.ideas, (state: RootState) => state.text.comments],
  (ideas, comments) => {
    const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
    const maxIdeaIdWithComment = Math.max(...Array.from(ideaIdsWithComments));
    return ideas.filter(idea => idea.id <= maxIdeaIdWithComment);
  }
)

export const { setOpenaiKey, setOpenaiOrgId, addIdea, addComment, setLastTimeActive } = textSlice.actions;
export default textSlice.reducer;