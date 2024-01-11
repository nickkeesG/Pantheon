import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Idea, IdeaExport, Comment, Node } from './models';


/**
 * 
 * @param nodes - The array of all nodes
 * @param ideaId - The ID of the idea
 * @returns The idea instance corresponding to the given id, or undefined if no such idea found
 */
const getIdea = (nodes: Node[], ideaId: number): Idea | undefined => {
  for (const node of nodes) {
    const foundIdea = node.ideas.find(idea => idea.id === ideaId);
    if (foundIdea) return foundIdea;
  }
  return undefined;
}

/**
 * 
 * @param nodes - The array of all nodes
 * @param ideaId - The ID of the idea
 * @returns The node holding the idea, or undefined if no such node found
 */
const getNodeForIdea = (nodes: Node[], ideaId: number): Node | undefined => {
  return nodes.find(node => node.ideas.some(idea => idea.id === ideaId));
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
  nodes: Node[];
  currentNodeId: number;
  currentBranchIds: number[];
}

const initialState: TextState = {
  lastTimeActive: Date.now(),
  nodes: [{
    id: 0,
    parentNodeId: null,
    parentIdeaId: null,
    ideas: []
  }],
  currentNodeId: 0,
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
        const node = getNodeForIdea(state.nodes, action.payload.id)!;
        state.currentBranchIds = getAllAncestorIds(node.ideas, action.payload.id);
      }
      else {
        state.currentBranchIds = [];
      }
    },
    changeBranch(state, action: PayloadAction<Idea>) {
      const newCurrentNode = getNodeForIdea(state.nodes, action.payload.id)!;
      const newCurrentIdea = getMostRecentDescendent(newCurrentNode.ideas, action.payload.id);
      state.currentBranchIds = getAllAncestorIds(newCurrentNode.ideas, newCurrentIdea.id);
      state.currentNodeId = newCurrentNode.id;
    },
    switchBranch(state, action: PayloadAction<{ parentIdea: Idea, moveForward: boolean }>) {
      const parentIdea = action.payload.parentIdea;
      const node = getNodeForIdea(state.nodes, action.payload.parentIdea.id)!;
      const childIdeas = getChildren(node.ideas, parentIdea.id);
      const currentChild = node.ideas.find(idea => idea.parentIdeaId === parentIdea.id && state.currentBranchIds.includes(idea.id));
      let newCurrentIdea: Idea;
      if (currentChild) {
        const currentIndex = childIdeas.findIndex(idea => idea.id === currentChild.id);
        const newChild = action.payload.moveForward
          ? childIdeas[(currentIndex + 1) % childIdeas.length]
          : childIdeas[(currentIndex - 1 + childIdeas.length) % childIdeas.length]
        newCurrentIdea = getMostRecentDescendent(node.ideas, newChild.id)
      } else {
        // User was likely adding a new branch but changed their mind
        newCurrentIdea = getMostRecentDescendent(node.ideas, parentIdea.id);
      }
      state.currentBranchIds = getAllAncestorIds(node.ideas, newCurrentIdea.id)
      state.currentNodeId = node.id;
    },
    addNode(state) {
      const parentNodeId = state.currentNodeId;
      const parentIdeaId = state.currentBranchIds[state.currentBranchIds.length - 1];
      const newNodeId = state.nodes[state.nodes.length - 1].id + 1;
      const newNode: Node = {
        id: newNodeId,
        parentNodeId,
        parentIdeaId,
        ideas: []
      };
      state.nodes.push(newNode);
      state.currentNodeId = newNodeId;
      state.currentBranchIds = [];
    },
    goUpNode(state) {
      const node = state.nodes.find(node => node.id === state.currentNodeId)!;
      const parentIdeaId = node.parentIdeaId!;
      const newNode = getNodeForIdea(state.nodes, parentIdeaId)!;
      const newCurrentIdea = getMostRecentDescendent(newNode.ideas, parentIdeaId);
      state.currentBranchIds = getAllAncestorIds(newNode.ideas, newCurrentIdea.id);
      state.currentNodeId = newNode.id;
      // If the current node has no ideas, delete it (user cancelled the creation)
      if (node.ideas.length === 0) {
        const index = state.nodes.findIndex(n => n.id === node.id);
        if (index !== -1) {
          state.nodes.splice(index, 1);
        }
      }
    },
    goDownNode(state, action: PayloadAction<{ newRootIdea: Idea }>) {
      const newRootIdea = action.payload.newRootIdea;
      const newNode = getNodeForIdea(state.nodes, newRootIdea.id)!;
      const newCurrentIdea = getMostRecentDescendent(newNode.ideas, newRootIdea.id);
      state.currentBranchIds = getAllAncestorIds(newNode.ideas, newCurrentIdea.id)
      state.currentNodeId = newNode.id;
    },
    addIdea(state, action: PayloadAction<{ text: string }>) {
      const parentId = state.currentBranchIds.length > 0 ? state.currentBranchIds[state.currentBranchIds.length - 1] : null;
      const node = state.nodes.find(node => node.id === state.currentNodeId)!;
      const newId = Date.now();
      const newIdea: Idea = {
        id: newId,
        parentIdeaId: parentId,
        text: action.payload.text,
        textTokens: [],
        tokenSurprisals: []
      };
      node.ideas.push(newIdea);
      state.currentBranchIds.push(newIdea.id);
    },
    setSurprisalToIdea(state, action: PayloadAction<{ ideaId: number, textTokens: string[], tokenSurprisals: number[] }>) {
      const idea = getIdea(state.nodes, action.payload.ideaId);
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
    (state: RootState) => state.text.nodes,
    (_: RootState, ideaId: number) => ideaId
  ], (nodes, ideaId) => {
    const node = getNodeForIdea(nodes, ideaId)!;
    return getChildren(node.ideas, ideaId);
  }
)

export const selectCurrentNode = createSelector(
  [
    (state: RootState) => state.text.nodes,
    (staet: RootState) => staet.text.currentNodeId
  ], (nodes, currentNodeId) => {
    return nodes.find(node => node.id === currentNodeId)!;
  }
);

export const selectCurrentBranchIdeas = createSelector(
  [
    (state: RootState) => state.text.nodes,
    (state: RootState) => state.text.currentNodeId,
    (state: RootState) => state.text.currentBranchIds
  ],
  (nodes, currentNodeId, currentBranchIds) => {
    const node = nodes.find(node => node.id === currentNodeId)!;
    return node.ideas.filter(idea => currentBranchIds.includes(idea.id));
  }
);

// TODO Probably ideas should also have references to their comments
export const selectRecentIdeasWithoutComments = createSelector(
  [(state: RootState) => state.text.nodes,
  (state: RootState) => state.text.currentNodeId,
  (state: RootState) => state.text.currentBranchIds,
  (state: RootState) => state.comment.comments],
  (nodes, currentNodeId, currentBranchIds, comments) => {
    const node = nodes.find(node => node.id === currentNodeId)!;
    return getIdeasSinceLastComment(node.ideas, currentBranchIds, comments);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: RootState) => state.text.nodes,
  (state: RootState) => state.text.currentNodeId,
  (state: RootState) => state.text.currentBranchIds,
  (state: RootState) => state.comment.comments],
  (nodes, currentNodeId, currentBranchIds, comments) => {
    const node = nodes.find(node => node.id === currentNodeId)!;
    const ideasSinceLastCommentIds = getIdeasSinceLastComment(node.ideas, currentBranchIds, comments);
    const ideasUpToMaxCommented = node.ideas.filter(idea => currentBranchIds.includes(idea.id) && !ideasSinceLastCommentIds.includes(idea));
    return ideasUpToMaxCommented;
  }
)

export const selectBranchesFromIdea = createSelector(
  [
    (state: RootState) => state.text.nodes,
    (state: RootState) => state.text.currentNodeId,
    (state: RootState) => state.text.currentBranchIds,
    (_: RootState, parentId: number) => parentId
  ],
  (nodes, currentNodeId, currentBranchIds, parentId) => {
    const node = nodes.find(node => node.id === currentNodeId)!;
    return node.ideas.filter(idea => idea.parentIdeaId === parentId && !currentBranchIds.includes(idea.id));
  }
)

export const selectChildNodeIdeas = createSelector(
  [
    (state: RootState) => state.text.nodes,
    (_: RootState, parentIdeaId: number) => parentIdeaId
  ],
  (nodes, parentIdeaId) => {
    return nodes
      .filter(node => node.parentIdeaId === parentIdeaId)
      .map(node => node.ideas[0]);
  }
)

export const selectFullContext = createSelector(
  [
    (state: RootState) => state.text.nodes,
    (state: RootState) => state.text.currentNodeId
  ],
  (nodes, currentNodeId) => {
    const ideas = nodes.find(node => node.id === currentNodeId)!.ideas;
    let rootIdea = ideas.find(idea => idea.parentIdeaId === null);
    let ideaExports = exploreBranch(ideas, rootIdea!);
    return ideaExports;
  }
)

export const { setCurrentIdea, changeBranch, switchBranch, addNode, goUpNode, goDownNode, addIdea, setSurprisalToIdea, setLastTimeActive, replaceTree } = textSlice.actions;
export default textSlice.reducer;