import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea } from './models';
import { exploreBranch, getIdeasSinceLastComment } from './storeUtils';

export interface IdeaState {
  ideas: { [id: number]: Idea };
}

const initialState: IdeaState = {
  ideas: {}
};

const ideaSlice = createSlice({
  name: 'idea',
  initialState,
  reducers: {
    addIdea(state, action: PayloadAction<Idea>) {
      const idea = action.payload;
      state.ideas[idea.id] = idea;
    },
    updateIdea(state, action: PayloadAction<Idea>) {
      const idea = action.payload;
      if (state.ideas[idea.id]) {
        state.ideas[idea.id] = idea;
      }
    },
    deleteIdea(state, action: PayloadAction<number>) {
      delete state.ideas[action.payload];
    },
    setSurprisalToIdea(state, action: PayloadAction<{ ideaId: number, textTokens: string[], tokenSurprisals: number[] }>) {
      const idea = state.ideas[action.payload.ideaId]!;
      idea.textTokens = action.payload.textTokens;
      idea.tokenSurprisals = action.payload.tokenSurprisals;
    },
    replaceSlice(state, action: PayloadAction<IdeaState>) {
      console.debug(action.payload)
      return action.payload;
    },
    resetIdeaSlice: (state) => initialState
  },
});

// TODO Add docstrings

export const selectIdeasById = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (_: RootState, ideaIds: number[]) => ideaIds
  ], (ideas, ideaIds) => {
    return ideaIds.map(id => ideas[id])
  }
)

export const selectIdeaBranches = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (state: RootState) => state.ui.activeIdeaIds,
    (_: RootState, parentIdeaId: number) => parentIdeaId
  ],
  (ideas, activeIdeaIds, parentIdeaId) => {
    return Object.values(ideas).filter(idea => idea.parentIdeaId === parentIdeaId && !activeIdeaIds.includes(idea.id));
  }
)

export const selectPageBranchRootIdeas = createSelector(
  [
    (state: RootState) => state.page.pages,
    (state: RootState) => state.idea.ideas,
    (_: RootState, parentIdeaId: number) => parentIdeaId
  ],
  (pages, ideas, parentIdeaId) => {
    const childPages = Object.values(pages)
      .filter(page => page.parentIdeaId === parentIdeaId);
    const rootIdeaIds = childPages.map(page => page.ideaIds[0]);
    return rootIdeaIds.map(id => ideas[id]);
  }
)

// TODO Probably ideas should also have references to their comments
export const selectActiveIdeasEligibleForComments = createSelector(
  [(state: RootState) => state.idea.ideas,
  (state: RootState) => state.ui.activeIdeaIds,
  (state: RootState) => state.comment.comments],
  (ideas, activeIdeaIds, comments) => {
    const activeBranchIdeas = activeIdeaIds.map(id => ideas[id]).filter(idea => idea.isUser);
    return getIdeasSinceLastComment(activeBranchIdeas, comments);
  }
)

export const selectActivePastIdeas = createSelector(
  [(state: RootState) => state.idea.ideas,
  (state: RootState) => state.ui.activeIdeaIds,
  (state: RootState) => state.comment.comments],
  (ideas, activeIdeaIds, comments) => {
    const activeBranchIdeas = activeIdeaIds.map(id => ideas[id]);
    const ideasSinceLastCommentIds = getIdeasSinceLastComment(activeBranchIdeas, comments);
    const ideasUpToMaxCommented = activeBranchIdeas.filter(idea => !ideasSinceLastCommentIds.includes(idea));
    return ideasUpToMaxCommented;
  }
)

export const selectPageContentForExporting = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (_: RootState, pageId: number) => pageId
  ], (ideas, pageId) => {
    const pageIdeas = Object.values(ideas).filter(idea => idea.pageId === pageId);
    const rootIdea = pageIdeas.find(idea => idea.parentIdeaId === null)!;
    return exploreBranch(pageIdeas, rootIdea);
  }
)

export const selectCurrentBranchIdeas = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (state: RootState) => state.ui.activeIdeaIds
  ], (ideas, activeIdeaIds) => {
    return activeIdeaIds.map(id => ideas[id]);
  }
)

export const { addIdea, updateIdea, deleteIdea, setSurprisalToIdea, replaceSlice, resetIdeaSlice } = ideaSlice.actions;
export default ideaSlice.reducer;
