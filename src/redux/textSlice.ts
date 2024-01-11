import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea, IdeaExport, Comment, Page } from './models';


/**
 * 
 * @param pages - The array of all pages
 * @param ideaId - The ID of the idea
 * @returns The idea instance corresponding to the given id, or undefined if no such idea found
 */
const getIdea = (pages: Page[], ideaId: number): Idea | undefined => {
  for (const page of pages) {
    const foundIdea = page.ideas.find(idea => idea.id === ideaId);
    if (foundIdea) return foundIdea;
  }
  return undefined;
}

/**
 * 
 * @param pages - The array of all pages
 * @param ideaId - The ID of the idea
 * @returns The page holding the idea, or undefined if no such page found
 */
const getPageForIdea = (pages: Page[], ideaId: number): Page | undefined => {
  return pages.find(page => page.ideas.some(idea => idea.id === ideaId));
}

/**
 * Retrieves all direct descendants of a given idea within the ideas array.
 * 
 * @param ideas - The array containing all ideas.
 * @param parentId - The ID of the parent idea.
 * @returns An array of ideas representing all the children of the given idea.
 */
const getChildren = (ideas: Idea[], parentId: number): Idea[] => {
  return ideas.filter(idea => idea.parentIdeaId === parentId);
}

/**
 * Finds the most recent descendent of a given ancestor idea within the entire tree.
 * 
 * @param ideas - The array of all ideas.
 * @param ancestorIdeaId - The ID of the ancestor idea for which to find the descendent.
 * @returns The most recent descendent of the given ancestor idea.
 */
const getMostRecentDescendent = (ideas: Idea[], ancestorIdeaId: number): Idea => {
  let mostRecentDescendent = ideas.find(idea => idea.id === ancestorIdeaId);
  if (!mostRecentDescendent) {
    throw new Error(`Ancestor idea with id ${ancestorIdeaId} not found`);
  }
  let queue = [mostRecentDescendent];
  while (queue.length > 0) {
    const currentIdea = queue.shift()!;
    const children = ideas.filter(idea => idea.parentIdeaId === currentIdea.id);
    queue.push(...children);
    if (currentIdea.id > mostRecentDescendent.id) {
      mostRecentDescendent = currentIdea;
    }
  }
  return mostRecentDescendent;
}

/**
 * Retrieves all ancestors of a given idea in the ideas array.
 * 
 * @param ideas - The array of all ideas.
 * @param lastIdeaId - The ID of the last idea in the chain of ancestors.
 * @returns An array of idea ids representing all the ancestors of the given idea.
 */
const getAllAncestorIds = (ideas: Idea[], lastIdeaId: number): number[] => {
  // Finds all the ancestor IDs of a given idea
  let ancestorIds: number[] = [];
  let currentId: number | null = lastIdeaId;

  const findIdeaById = (id: number) => ideas.find(idea => idea.id === id);

  while (currentId) {
    const current = findIdeaById(currentId);
    if (!current) {
      console.error("Error finding idea list! IdeaId: " + currentId);
      break;
    }
    ancestorIds.unshift(current.id);
    currentId = current.parentIdeaId;
  }

  return ancestorIds;
};

/**
 * Retrieves all ideas since the most recent idea that has received comments.
 * 
 * @param ideas 
 * @param comments 
 * @returns 
 */
const getIdeasSinceLastComment = (ideas: Idea[], ideaIds: number[], comments: Record<number, Comment>): Idea[] => {
  const ideaIdsWithComments = new Set(Object.values(comments).map(comment => comment.ideaId));
  const newestIdeaIdWithComments = Math.max(...Array.from(ideaIdsWithComments));
  return ideas.filter(idea => ideaIds.includes(idea.id) && idea.id > newestIdeaIdWithComments);
}

// TODO All this logic should probably be moved to another file
function exploreBranch(ideas: Idea[], selectedIdea: Idea): IdeaExport[] {
  let ideaExports: IdeaExport[] = [];
  let openIdeas: Idea[] = []; // Ideas that have multiple children (that need to be followed up on)
  while (selectedIdea) {
    let newExport = {
      text: selectedIdea.text,
      incoming: false,
      outgoing: false
    }
    let children = getChildren(ideas, selectedIdea.id);
    if (children.length > 1) {
      newExport.outgoing = true;
      openIdeas.push(selectedIdea); //save the idea to follow up on later
    }
    ideaExports.push(newExport);

    if (children.length === 0) {
      break;
    } else {
      selectedIdea = children[0];
    }
  }

  // Now follow up on the open ideas
  for (let i = 0; i < openIdeas.length; i++) {
    let currentIdea = openIdeas[i];
    let newExport = {
      text: currentIdea.text,
      incoming: true,
      outgoing: false
    }
    ideaExports.push(newExport);
    let children = ideas.filter(idea => idea.parentIdeaId === currentIdea.id);
    for (let j = 1; j < children.length; j++) { //skip the first child, since we already explored it
      let newBranch = exploreBranch(ideas, children[j]); //
      ideaExports.push(...newBranch);
    }
  }

  return ideaExports;
}

export interface TextState {
  lastTimeActive: number;
  pages: Page[];
  currentPageId: number;
  currentBranchIds: number[];
}

const initialState: TextState = {
  lastTimeActive: Date.now(),
  pages: [{
    id: 0,
    parentPageId: null,
    parentIdeaId: null,
    ideas: []
  }],
  currentPageId: 0,
  currentBranchIds: [],
};

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    setLastTimeActive(state) {
      state.lastTimeActive = Date.now();
    },
    setCurrentIdea(state, action: PayloadAction<Idea | null>) {
      if (action.payload) {
        const page = getPageForIdea(state.pages, action.payload.id)!;
        state.currentBranchIds = getAllAncestorIds(page.ideas, action.payload.id);
      }
      else {
        state.currentBranchIds = [];
      }
    },
    changeBranch(state, action: PayloadAction<Idea>) {
      const newCurrentPage = getPageForIdea(state.pages, action.payload.id)!;
      const newCurrentIdea = getMostRecentDescendent(newCurrentPage.ideas, action.payload.id);
      state.currentBranchIds = getAllAncestorIds(newCurrentPage.ideas, newCurrentIdea.id);
      state.currentPageId = newCurrentPage.id;
    },
    switchBranch(state, action: PayloadAction<{ parentIdea: Idea, moveForward: boolean }>) {
      const parentIdea = action.payload.parentIdea;
      const page = getPageForIdea(state.pages, action.payload.parentIdea.id)!;
      const childIdeas = getChildren(page.ideas, parentIdea.id);
      const currentChild = page.ideas.find(idea => idea.parentIdeaId === parentIdea.id && state.currentBranchIds.includes(idea.id));
      let newCurrentIdea: Idea;
      if (currentChild) {
        const currentIndex = childIdeas.findIndex(idea => idea.id === currentChild.id);
        const newChild = action.payload.moveForward
          ? childIdeas[(currentIndex + 1) % childIdeas.length]
          : childIdeas[(currentIndex - 1 + childIdeas.length) % childIdeas.length]
        newCurrentIdea = getMostRecentDescendent(page.ideas, newChild.id)
      } else {
        // User was likely adding a new branch but changed their mind
        newCurrentIdea = getMostRecentDescendent(page.ideas, parentIdea.id);
      }
      state.currentBranchIds = getAllAncestorIds(page.ideas, newCurrentIdea.id)
      state.currentPageId = page.id;
    },
    addPage(state) {
      const parentPageId = state.currentPageId;
      const parentIdeaId = state.currentBranchIds[state.currentBranchIds.length - 1];
      const newPageId = state.pages[state.pages.length - 1].id + 1;
      const newPage: Page = {
        id: newPageId,
        parentPageId: parentPageId,
        parentIdeaId,
        ideas: []
      };
      state.pages.push(newPage);
      state.currentPageId = newPageId;
      state.currentBranchIds = [];
    },
    goUpPage(state) {
      const page = state.pages.find(page => page.id === state.currentPageId)!;
      const parentIdeaId = page.parentIdeaId!;
      const newPage = getPageForIdea(state.pages, parentIdeaId)!;
      const newCurrentIdea = getMostRecentDescendent(newPage.ideas, parentIdeaId);
      state.currentBranchIds = getAllAncestorIds(newPage.ideas, newCurrentIdea.id);
      state.currentPageId = newPage.id;
      // If the current page has no ideas, delete it (user cancelled the creation)
      if (page.ideas.length === 0) {
        const index = state.pages.findIndex(n => n.id === page.id);
        if (index !== -1) {
          state.pages.splice(index, 1);
        }
      }
    },
    goDownPage(state, action: PayloadAction<{ newRootIdea: Idea }>) {
      const newRootIdea = action.payload.newRootIdea;
      const newPage = getPageForIdea(state.pages, newRootIdea.id)!;
      const newCurrentIdea = getMostRecentDescendent(newPage.ideas, newRootIdea.id);
      state.currentBranchIds = getAllAncestorIds(newPage.ideas, newCurrentIdea.id)
      state.currentPageId = newPage.id;
    },
    addIdea(state, action: PayloadAction<{ text: string }>) {
      const parentId = state.currentBranchIds.length > 0 ? state.currentBranchIds[state.currentBranchIds.length - 1] : null;
      const page = state.pages.find(page => page.id === state.currentPageId)!;
      const newId = Date.now();
      const newIdea: Idea = {
        id: newId,
        parentIdeaId: parentId,
        text: action.payload.text,
        textTokens: [],
        tokenSurprisals: []
      };
      page.ideas.push(newIdea);
      state.currentBranchIds.push(newIdea.id);
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
    (_: RootState, ideaId: number) => ideaId
  ], (pages, ideaId) => {
    const page = getPageForIdea(pages, ideaId)!;
    return getChildren(page.ideas, ideaId);
  }
)

export const selectCurrentPage = createSelector(
  [
    (state: RootState) => state.text.pages,
    (staet: RootState) => staet.text.currentPageId
  ], (pages, currentPateId) => {
    return pages.find(page => page.id === currentPateId)!;
  }
);

export const selectCurrentBranchIdeas = createSelector(
  [
    (state: RootState) => state.text.pages,
    (state: RootState) => state.text.currentPageId,
    (state: RootState) => state.text.currentBranchIds
  ],
  (pages, currentPageId, currentBranchIds) => {
    const page = pages.find(page => page.id === currentPageId)!;
    return page.ideas.filter(idea => currentBranchIds.includes(idea.id));
  }
);

// TODO Probably ideas should also have references to their comments
export const selectRecentIdeasWithoutComments = createSelector(
  [(state: RootState) => state.text.pages,
  (state: RootState) => state.text.currentPageId,
  (state: RootState) => state.text.currentBranchIds,
  (state: RootState) => state.comment.comments],
  (pages, currentPageId, currentBranchIds, comments) => {
    const page = pages.find(page => page.id === currentPageId)!;
    return getIdeasSinceLastComment(page.ideas, currentBranchIds, comments);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: RootState) => state.text.pages,
  (state: RootState) => state.text.currentPageId,
  (state: RootState) => state.text.currentBranchIds,
  (state: RootState) => state.comment.comments],
  (pages, currentPageId, currentBranchIds, comments) => {
    const page = pages.find(page => page.id === currentPageId)!;
    const ideasSinceLastCommentIds = getIdeasSinceLastComment(page.ideas, currentBranchIds, comments);
    const ideasUpToMaxCommented = page.ideas.filter(idea => currentBranchIds.includes(idea.id) && !ideasSinceLastCommentIds.includes(idea));
    return ideasUpToMaxCommented;
  }
)

export const selectBranchesFromIdea = createSelector(
  [
    (state: RootState) => state.text.pages,
    (state: RootState) => state.text.currentPageId,
    (state: RootState) => state.text.currentBranchIds,
    (_: RootState, parentId: number) => parentId
  ],
  (pages, currentPageId, currentBranchIds, parentId) => {
    const page = pages.find(page => page.id === currentPageId)!;
    return page.ideas.filter(idea => idea.parentIdeaId === parentId && !currentBranchIds.includes(idea.id));
  }
)

export const selectChildPageIdeas = createSelector(
  [
    (state: RootState) => state.text.pages,
    (_: RootState, parentIdeaId: number) => parentIdeaId
  ],
  (pages, parentIdeaId) => {
    return pages
      .filter(page => page.parentIdeaId === parentIdeaId)
      .map(page => page.ideas[0]);
  }
)

export const selectFullContext = createSelector(
  [
    (state: RootState) => state.text.pages,
    (state: RootState) => state.text.currentPageId
  ],
  (pages, currentPageId) => {
    const ideas = pages.find(page => page.id === currentPageId)!.ideas;
    let rootIdea = ideas.find(idea => idea.parentIdeaId === null);
    let ideaExports = exploreBranch(ideas, rootIdea!);
    return ideaExports;
  }
)

export const { setCurrentIdea, changeBranch, switchBranch, addPage, goUpPage, goDownPage, addIdea, setSurprisalToIdea, setLastTimeActive, replaceTree } = textSlice.actions;
export default textSlice.reducer;