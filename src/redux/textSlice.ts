import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea, Page } from './models';
import { exploreBranch, getChildren, getIdea, getIdeasSinceLastComment } from './storeUtils';


export interface TextState {
  pages: { [key: number]: Page };
}

const initialState: TextState = {
  pages: {
    0: {
      id: 0,
      parentPageId: null,
      parentIdeaId: null,
      ideas: []
    }
  }
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    addPage(state, action: PayloadAction<Page>) {
      const page = action.payload;
      state.pages[page.id] = page;
    },
    deletePage(state, action: PayloadAction<number>) {
      delete state.pages[action.payload];
    },
    addIdea(state, action: PayloadAction<Idea>) {
      const page = state.pages[action.payload.pageId];
      page.ideas.push(action.payload);
    },
    setSurprisalToIdea(state, action: PayloadAction<{ ideaId: number, textTokens: string[], tokenSurprisals: number[] }>) {
      const idea = getIdea(state.pages, action.payload.ideaId);
      if (idea) {
        idea.textTokens = action.payload.textTokens;
        idea.tokenSurprisals = action.payload.tokenSurprisals;
        if (idea.textTokens.length === 0) {
          console.error("Error setting surprisal for idea! length still zero IdeaId: " + idea.id);
        }
      }
      else {
        console.error("Error finding idea to set surprisal for! IdeaId: " + action.payload.ideaId);
      }
    },
    replaceTree(state, action: PayloadAction<TextState>) {
      return action.payload;
    }
  },
});

export const selectChildrenOfIdea = createSelector(
  [
    (state: RootState) => state.text.pages,
    (_: RootState, idea: Idea) => idea
  ], (pages, idea) => {
    const page = pages[idea.pageId];
    return getChildren(page.ideas, idea.id);
  }
)

export const selectCurrentPage = createSelector(
  [
    (state: RootState) => state.text.pages,
    (staet: RootState) => staet.ui.activePageId
  ], (pages, currentPageId) => {
    return pages[currentPageId];
  }
);

export const selectCurrentBranchIdeas = createSelector(
  [
    (state: RootState) => state.text.pages,
    (state: RootState) => state.ui.activePageId,
    (state: RootState) => state.ui.activeIdeaIds
  ],
  (pages, currentPageId, currentBranchIds) => {
    const page = pages[currentPageId];
    return page.ideas.filter(idea => currentBranchIds.includes(idea.id));
  }
);

// TODO Probably ideas should also have references to their comments
export const selectRecentIdeasWithoutComments = createSelector(
  [(state: RootState) => state.text.pages,
  (state: RootState) => state.ui.activePageId,
  (state: RootState) => state.ui.activeIdeaIds,
  (state: RootState) => state.comment.comments],
  (pages, currentPageId, currentBranchIds, comments) => {
    const page = pages[currentPageId];
    return getIdeasSinceLastComment(page.ideas, currentBranchIds, comments);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: RootState) => state.text.pages,
  (state: RootState) => state.ui.activePageId,
  (state: RootState) => state.ui.activeIdeaIds,
  (state: RootState) => state.comment.comments],
  (pages, currentPageId, currentBranchIds, comments) => {
    const page = pages[currentPageId];
    const ideasSinceLastCommentIds = getIdeasSinceLastComment(page.ideas, currentBranchIds, comments);
    const ideasUpToMaxCommented = page.ideas.filter(idea => currentBranchIds.includes(idea.id) && !ideasSinceLastCommentIds.includes(idea));
    return ideasUpToMaxCommented;
  }
)

export const selectBranchesFromIdea = createSelector(
  [
    (state: RootState) => state.text.pages,
    (state: RootState) => state.ui.activePageId,
    (state: RootState) => state.ui.activeIdeaIds,
    (_: RootState, parentId: number) => parentId
  ],
  (pages, currentPageId, currentBranchIds, parentId) => {
    const page = pages[currentPageId];
    return page.ideas.filter(idea => idea.parentIdeaId === parentId && !currentBranchIds.includes(idea.id));
  }
)

export const selectChildPageIdeas = createSelector(
  [
    (state: RootState) => state.text.pages,
    (_: RootState, parentIdeaId: number) => parentIdeaId
  ],
  (pages, parentIdeaId) => {
    const childPages = Object.values(pages)
      .filter(page => page.parentIdeaId === parentIdeaId);
    return childPages.map(page => page.ideas[0]);
  }
)

export const selectFullContext = createSelector(
  [
    (state: RootState) => state.text.pages,
    (state: RootState) => state.ui.activePageId
  ],
  (pages, currentPageId) => {
    const ideas = pages[currentPageId].ideas;
    let rootIdea = ideas.find(idea => idea.parentIdeaId === null);
    let ideaExports = exploreBranch(ideas, rootIdea!);
    return ideaExports;
  }
)

export const { addPage, deletePage, addIdea, setSurprisalToIdea, replaceTree } = textSlice.actions;
export default textSlice.reducer;