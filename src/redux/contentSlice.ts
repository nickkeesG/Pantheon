import { createSlice, createSelector, PayloadAction, configureStore } from '@reduxjs/toolkit';

export interface Idea {
  id: number;
  text: string;
}

export interface Comment {
  id: number;
  ideaId: number;
  text: string;
  daemonName: string;
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
    addComment(state, action: PayloadAction<{ ideaId: number, text: string, daemonName: string}>) {
      const newId = state.comments.length > 0 ? state.comments[state.comments.length - 1].id + 1 : 0;
      const newComment: Comment = {
        id: newId,
        ideaId: action.payload.ideaId,
        text: action.payload.text,
        daemonName: action.payload.daemonName
      };
      state.comments.push(newComment);
    }
  },
});

export const selectCommentsByIdeaId = createSelector(
  [(state: TextState, ideaId: number) => ideaId, (state: TextState) => state.comments],
  (ideaId, comments) => comments.filter(comment => comment.ideaId === ideaId)
)

export const selectRecentIdeasWithoutComments = createSelector(
  [(state: TextState) => state.ideas, (state: TextState) => state.comments],
  (ideas, comments) => {
    const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
    const maxIdeaIdWithComment = Math.max(...Array.from(ideaIdsWithComments));
    return ideas.filter(idea => !ideaIdsWithComments.has(idea.id) && idea.id > maxIdeaIdWithComment);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: TextState) => state.ideas, (state: TextState) => state.comments],
  (ideas, comments) => {
    const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
    const maxIdeaIdWithComment = Math.max(...Array.from(ideaIdsWithComments));
    return ideas.filter(idea => idea.id <= maxIdeaIdWithComment);
  }
)

export const { setOpenaiKey, setOpenaiOrgId, addIdea, addComment, setLastTimeActive} = textSlice.actions;
export const store = configureStore({
  reducer: textSlice.reducer
});
