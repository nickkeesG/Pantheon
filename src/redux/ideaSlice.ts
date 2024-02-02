import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea } from './models';
import { exploreBranch, getIdeasSinceLastComment, getMostRecentDescendent } from './storeUtils';

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
    replaceSlice: (_, action: PayloadAction<IdeaState>) => action.payload,
    resetSlice: (_) => initialState
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

export const selectSectionBranchRootIdeas = createSelector(
  [
    (state: RootState) => state.section.sections,
    (state: RootState) => state.idea.ideas,
    (_: RootState, parentIdeaId: number) => parentIdeaId
  ],
  (sections, ideas, parentIdeaId) => {
    const childSections = Object.values(sections)
      .filter(section => section.parentIdeaId === parentIdeaId);
    const rootIdeaIds = childSections.map(section => section.ideaIds[0]);
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

export const selectSectionContentForExporting = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (_: RootState, sectionId: number) => sectionId
  ], (ideas, sectionId) => {
    const sectionIdeas = Object.values(ideas).filter(idea => idea.sectionId === sectionId);
    const rootIdea = sectionIdeas.find(idea => idea.parentIdeaId === null)!;
    return exploreBranch(sectionIdeas, rootIdea);
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

export const selectMostRecentIdeaInTree = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (state: RootState) => state.section.sections,
    (_: RootState, treeId: number) => treeId
  ], (ideas, sections, treeId) => {
    let mostRecentIdea = null;
    const treeSections = Object.values(sections).filter(section => section.treeId === treeId);
    for (const section of treeSections) {
      if (section.ideaIds.length === 0) continue;
      const firstIdea = section.ideaIds[0];
      const sectionIdeas = section.ideaIds.map(id => ideas[id]);
      const mostRecentIdeaInSection = getMostRecentDescendent(sectionIdeas, firstIdea);
      if (!mostRecentIdea || mostRecentIdeaInSection.id > mostRecentIdea.id) {
        mostRecentIdea = mostRecentIdeaInSection;
      }
    }
    return mostRecentIdea
  }
)

export const { addIdea, updateIdea, deleteIdea, setSurprisalToIdea, replaceSlice: replaceIdeaSlice, resetSlice: resetIdeaSlice } = ideaSlice.actions;
export const initialIdeaState = initialState;
export default ideaSlice.reducer;
