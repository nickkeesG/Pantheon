import { createSlice, createSelector, PayloadAction, configureStore } from '@reduxjs/toolkit';

export interface Idea {
  id: number;
  text: string;
}

export interface Comment {
  id: number;
  ideaId: number;
  text: string;
}

export interface TextState {
  openaiKey: string;
  openaiOrgId: string;
  lastTimeActive: number;
  ideas: Idea[];
  comments: Comment[];
}

const initialState: TextState = {
  openaiKey: '',
  openaiOrgId: '',
  lastTimeActive: Date.now(),
  ideas: [
    { id: 0, text: "Ooh, new writing app!" },
    { id: 1, text: "I don't know what to write about..." },
    { id: 2, text: "I'm feeling creative." }],
  comments: [{ id: 0, ideaId: 1, text: "Here's an idea: Write about how you're feeling in this moment." }]
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setOpenaiKey(state, action: PayloadAction<string>) {
      state.openaiKey = action.payload;
    },
    setOpenaiOrgId(state, action: PayloadAction<string>) {
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
    addComment(state, action: PayloadAction<{ ideaId: number, text: string }>) {
      const newId = state.comments.length > 0 ? state.comments[state.comments.length - 1].id + 1 : 0;
      const newComment: Comment = {
        id: newId,
        ideaId: action.payload.ideaId,
        text: action.payload.text
      };
      state.comments.push(newComment);
    }
  },
});

export const selectCommentsByIdeaId = createSelector(
  [(state: TextState, ideaId: number) => ideaId, (state: TextState) => state.comments],
  (ideaId, comments) => comments.filter(comment => comment.ideaId === ideaId)
)

export const { setOpenaiKey, setOpenaiOrgId, addIdea, addComment, setLastTimeActive} = textSlice.actions;
export const store = configureStore({
  reducer: textSlice.reducer
});
