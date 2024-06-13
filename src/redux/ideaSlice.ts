import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea, IdeaType } from './models';
import { getIdeasSinceLastComment, getMostRecentDescendent } from './storeUtils';


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
    deleteIdeas(state, action: PayloadAction<number[]>) {
      action.payload.forEach(ideaId => {
        delete state.ideas[ideaId];
      });
    },
    setSurprisalToIdea(state, action: PayloadAction<{ ideaId: number, textTokens: string[], tokenSurprisals: number[] }>) {
      const idea = state.ideas[action.payload.ideaId]!;
      idea.textTokens = action.payload.textTokens;
      idea.tokenSurprisals = action.payload.tokenSurprisals;
    },
    setMentionToIdea(state, action: PayloadAction<{ ideaId: number, mention: string }>) {
      const idea = state.ideas[action.payload.ideaId]!;
      idea.mention = action.payload.mention;
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
    const missingIdeas = ideaIds.filter(id => !ideas[id]);
    if (missingIdeas.length > 0) {
      console.warn("Couldn't find some ideas", missingIdeas);
    }
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
export const selectActiveThoughtsEligibleForComments = createSelector(
  [(state: RootState) => state.idea.ideas,
  (state: RootState) => state.ui.activeIdeaIds,
  (state: RootState) => state.comment.comments],
  (ideas, activeIdeaIds, comments) => {
    try {
      // filter out ideas that are not thoughts
      const activeBranchIdeas = activeIdeaIds.map(id => ideas[id]).filter(idea => (idea.type === IdeaType.User));
      const activeBranchComments = Object.values(comments).filter(comment => activeIdeaIds.includes(comment.ideaId));
      return getIdeasSinceLastComment(activeBranchIdeas, activeBranchComments);
    } catch (e) {
      if (e instanceof TypeError) {
        // The active tree was probably deleted
        return []
      } else {
        throw e;
      }
    }
  }
)

export const selectActivePastThoughts = createSelector(
  [(state: RootState) => state.idea.ideas,
  (state: RootState) => state.ui.activeIdeaIds,
  (state: RootState) => state.comment.comments],
  (ideas, activeIdeaIds, comments) => {
    try {
      // filter out ideas that are not thoughts
      const activeBranchIdeas = activeIdeaIds.map(id => ideas[id]).filter(idea => (idea.type === IdeaType.User));
      const activeBranchComments = Object.values(comments).filter(comment => activeIdeaIds.includes(comment.ideaId));
      const ideasSinceLastCommentIds = getIdeasSinceLastComment(activeBranchIdeas, activeBranchComments);
      const ideasUpToMaxCommented = activeBranchIdeas.filter(idea => !ideasSinceLastCommentIds.includes(idea));
      return ideasUpToMaxCommented;
    } catch (e) {
      if (e instanceof TypeError) {
        // The active tree was probably deleted
        return []
      } else {
        throw e;
      }
    }
  }
)

export const selectCurrentBranchThoughts = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (state: RootState) => state.ui.activeIdeaIds
  ], (ideas, activeIdeaIds) => {
    // filter out ideas that are not thoughts
    let activeIdeas = activeIdeaIds.map(id => ideas[id]).filter(idea => (idea.type === IdeaType.User));
    return activeIdeas;
  }
)

export const selectIdeasInTree = createSelector(
  [
    (state: RootState) => state.idea.ideas,
    (state: RootState) => state.section.sections,
    (_: RootState, treeId: number) => treeId
  ], (ideas, sections, treeId) => {
    const treeSections = Object.values(sections).filter(section => section.treeId === treeId);
    const treeIdeas = treeSections.flatMap(section => section.ideaIds.map(id => ideas[id]));
    return treeIdeas;
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

export const { addIdea, updateIdea, deleteIdeas, setSurprisalToIdea, setMentionToIdea, replaceSlice: replaceIdeaSlice, resetSlice: resetIdeaSlice } = ideaSlice.actions;
export const initialIdeaState = initialState;
export default ideaSlice.reducer;
