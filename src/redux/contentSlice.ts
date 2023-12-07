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
  openaiKey: string;
  openaiOrgId: string;
  lastTimeActive: number;
  ideas: Idea[];
  comments: Comment[];
}

const initialState: TextState = {
  openaiKey: localStorage.getItem('openaiKey') || '',
  openaiOrgId: localStorage.getItem('openaiOrgId') || '',
  lastTimeActive: Date.now(),
  ideas: [
    { id: 0, text: "Ooh, new writing app!" },
    { id: 1, text: "I don't know what to write about..." },
    { id: 2, text: "I'm feeling creative." },
    { id: 3, text: "I don't know what to write about..." },
    { id: 4, text: "I don't know what to write about..." },
    { id: 5, text: "I don't know what to write about..." }],
  comments: [
    { id: 0, ideaId: 1, text: "Here's an idea: Write about how you're feeling in this moment.", daemonName: 'DefaultName'},
    { id: 1, ideaId: 1, text: "You could also write about your weekend plans.", daemonName: 'DefaultName'},
    { id: 2, ideaId: 2, text: "It sounds like you're feeling inspired!", daemonName: 'DefaultName'},
    { id: 3, ideaId: 5, text: "Don't give up!", daemonName: 'DefaultName'}
  ]
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setOpenaiKey(state, action: PayloadAction<string>) {
      localStorage.setItem('openaiKey', action.payload);
      state.openaiKey = action.payload;
    },
    setOpenaiOrgId(state, action: PayloadAction<string>) {
      localStorage.setItem('openaiOrgId', action.payload);
      state.openaiOrgId = action.payload;
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
