import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea, IdeaExport, Comment } from './models';

/**
 * Finds the most recent descendent of a given ancestor idea within the entire tree.
 * 
 * @param ideas - The array of all ideas.
 * @param ancestorIdea - The ancestor idea for which to find the descendent.
 * @returns The most recent descendent of the given ancestor idea.
 */
const getMostRecentDescendent = (ideas: Idea[], ancestorIdea: Idea): Idea => {
  let mostRecentDescendent = ancestorIdea;
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
 * Retrieves all direct descendants of a given idea in the ideas array.
 * 
 * @param ideas - The array of all ideas.
 * @param parentId - The ID of the parent idea.
 * @returns An array of ideas representing all the children of the given idea.
 */
const getChildren = (ideas: Idea[], parentId: number): Idea[] => {
  return ideas.filter(idea => idea.parentIdeaId === parentId);
}

/**
 * Retrieves all ideas since the most recent idea that has received comments.
 * 
 * @param ideas 
 * @param comments 
 * @returns 
 */
const getIdeasSinceLastComment = (ideas: Idea[], ideaIds: number[], comments: Comment[]): Idea[] => {
  const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
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
  ideas: Idea[];
  currentBranchIds: number[];
  comments: Comment[];
}

const initialState: TextState = {
  lastTimeActive: Date.now(),
  ideas: [],
  currentBranchIds: [],
  comments: []
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
        state.currentBranchIds = getAllAncestorIds(state.ideas, action.payload.id)
      }
      else {
        state.currentBranchIds = [];
      }
    },
    changeBranch(state, action: PayloadAction<Idea>) {
      const newCurrentIdea = getMostRecentDescendent(state.ideas, action.payload)
      state.currentBranchIds = getAllAncestorIds(state.ideas, newCurrentIdea.id)
    },
    switchBranch(state, action: PayloadAction<{ parentIdea: Idea, moveForward: boolean }>) {
      const parentIdea = action.payload.parentIdea;
      const childIdeas = getChildren(state.ideas, parentIdea.id);
      const currentChild = state.ideas.find(idea => idea.parentIdeaId === parentIdea.id && state.currentBranchIds.includes(idea.id));
      let newCurrentIdea: Idea;
      if (currentChild) {
        const currentIndex = childIdeas.findIndex(idea => idea.id === currentChild.id);
        const newChild = action.payload.moveForward
          ? childIdeas[(currentIndex + 1) % childIdeas.length]
          : childIdeas[(currentIndex - 1 + childIdeas.length) % childIdeas.length]
        newCurrentIdea = getMostRecentDescendent(state.ideas, newChild)
      } else {
        // User was likely adding a new branch but changed their mind
        newCurrentIdea = getMostRecentDescendent(state.ideas, parentIdea);
      }
      state.currentBranchIds = getAllAncestorIds(state.ideas, newCurrentIdea.id)
    },
    addIdea(state, action: PayloadAction<{ text: string }>) {
      const parentId = state.currentBranchIds.length > 0 ? state.currentBranchIds[state.currentBranchIds.length - 1] : null;
      const newId = Date.now();
      const newIdea: Idea = {
        id: newId,
        parentIdeaId: parentId,
        text: action.payload.text,
        textTokens: [],
        tokenSurprisals: []
      };
      state.ideas.push(newIdea);
      state.currentBranchIds.push(newIdea.id);
    },
    addComment(state, action: PayloadAction<{ ideaId: number, text: string, daemonName: string, daemonType: string }>) {
      const newId = state.comments.length > 0 ? state.comments[state.comments.length - 1].id + 1 : 0;
      const newComment: Comment = {
        id: newId,
        ideaId: action.payload.ideaId,
        text: action.payload.text,
        daemonName: action.payload.daemonName,
        daemonType: action.payload.daemonType,
        userApproved: false
      };
      state.comments.push(newComment);
    },
    approveComment(state, action: PayloadAction<{ commentId: number }>) {
      const comment = state.comments.find(comment => comment.id === action.payload.commentId);
      if (!comment) console.error("Error fetching comment " + action.payload.commentId);
      else comment.userApproved = true;
    },
    setSurprisalToIdea(state, action: PayloadAction<{ ideaId: number, textTokens: string[], tokenSurprisals: number[] }>) {
      const idea = state.ideas.find(idea => idea.id === action.payload.ideaId);
      if (idea) {
        idea.textTokens = action.payload.textTokens;
        idea.tokenSurprisals = action.payload.tokenSurprisals;
        if (idea.textTokens.length === 0) {
          console.error("Error setting surprisal for idea! length still zero IdeaId: " + idea.id);
        }
        else {
          console.log("IdeaId: " + idea.id);
          console.log("textTokens: " + idea.textTokens);
          console.log("tokenSurprisals: " + idea.tokenSurprisals);
        }
      }
      else {
        console.error("Error finding idea to set surprisal for! IdeaId: " + action.payload.ideaId);
      }
    }
  },
});

export const selectChildrenOfIdea = createSelector(
  [
    (state: RootState) => state.text.ideas,
    (_: RootState, ideaId: number) => ideaId
  ], (ideas, ideaId) => {
    return getChildren(ideas, ideaId);
  }
)

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

export const selectCurrentBranchIdeas = createSelector(
  [
    (state: RootState) => state.text.ideas,
    (state: RootState) => state.text.currentBranchIds
  ],
  (ideas, currentBranchIds) => {
    return ideas.filter(idea => currentBranchIds.includes(idea.id));
  }
);

export const selectRecentIdeasWithoutComments = createSelector(
  [(state: RootState) => state.text.ideas,
  (state: RootState) => state.text.currentBranchIds,
  (state: RootState) => state.text.comments],
  (ideas, currentBranchIds, comments) => {
    return getIdeasSinceLastComment(ideas, currentBranchIds, comments);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: RootState) => state.text.ideas,
  (state: RootState) => state.text.currentBranchIds,
  (state: RootState) => state.text.comments],
  (ideas, currentBranchIds, comments) => {
    const ideasSinceLastCommentIds = getIdeasSinceLastComment(ideas, currentBranchIds, comments);
    const ideasUpToMaxCommented = ideas.filter(idea => currentBranchIds.includes(idea.id) && !ideasSinceLastCommentIds.includes(idea));
    return ideasUpToMaxCommented;
  }
)

export const selectBranchesFromIdea = createSelector(
  [
    (state: RootState) => state.text.ideas,
    (state: RootState) => state.text.currentBranchIds,
    (_: RootState, parentId: number) => parentId
  ],
  (ideas, currentBranchIds, parentId) => {
    return ideas.filter(idea => idea.parentIdeaId === parentId && !currentBranchIds.includes(idea.id));
  }
)

export const selectFullContext = createSelector(
  [
    (state: RootState) => state.text.ideas
  ],
  (ideas) => {
    let rootIdea = ideas.find(idea => idea.parentIdeaId === null);
    let ideaExports = exploreBranch(ideas, rootIdea!);
    return ideaExports;
  }
)

export const { setCurrentIdea, changeBranch, switchBranch, addIdea, addComment, approveComment, setSurprisalToIdea, setLastTimeActive } = textSlice.actions;
export default textSlice.reducer;