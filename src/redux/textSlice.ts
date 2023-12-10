import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface Idea {
  id: number;
  parentIdeaId: number | null;
  text: string;
}

export interface Comment {
  id: number;
  ideaId: number;
  text: string;
  daemonName: string;
  daemonType: string;
}

export interface TextState {
  lastTimeActive: number;
  ideas: Idea[];
  currentIdea: Idea | null;
  comments: Comment[];
}

const initialState: TextState = {
  lastTimeActive: Date.now(),
  ideas: [],
  currentIdea: null,
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
      state.currentIdea = action.payload;
    },
    changeBranch(state, action: PayloadAction<Idea>) {
      // TODO Functions like this would be faster if ideas also kept track of their child ideas
      // Find the most recent descendent of the given ancestor idea through the whole tree
      const ideas = state.ideas
      let mostRecentDescendent: Idea | null = action.payload;
      let queue = [mostRecentDescendent];
      while (queue.length > 0) {
        const currentIdea = queue.shift()!;
        const children = ideas.filter(idea => idea.parentIdeaId === currentIdea.id);
        queue.push(...children);
        if (currentIdea.id > mostRecentDescendent.id) {
          mostRecentDescendent = currentIdea;
        }
      }

      state.currentIdea = mostRecentDescendent;
    },
    addIdea(state, action: PayloadAction<{ parentIdeaId: number | null, text: string }>) {
      const newId = Date.now();
      const newIdea: Idea = {
        id: newId,
        parentIdeaId: action.payload.parentIdeaId,
        text: action.payload.text
      };
      state.ideas.push(newIdea);
      state.currentIdea = newIdea;
    },
    addComment(state, action: PayloadAction<{ ideaId: number, text: string, daemonName: string, daemonType: string }>) {
      const newId = state.comments.length > 0 ? state.comments[state.comments.length - 1].id + 1 : 0;
      const newComment: Comment = {
        id: newId,
        ideaId: action.payload.ideaId,
        text: action.payload.text,
        daemonName: action.payload.daemonName,
        daemonType: action.payload.daemonType
      };
      state.comments.push(newComment);
    }
  },
});

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

export const selectRecentIdeasWithoutComments = createSelector(
  [(state: RootState) => state.text.ideas, (state: RootState) => state.text.comments],
  (ideas, comments) => {
    const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
    const maxIdeaIdWithComment = Math.max(...Array.from(ideaIdsWithComments));
    return ideas.filter(idea => !ideaIdsWithComments.has(idea.id) && idea.id > maxIdeaIdWithComment);
  }
)

export const selectIdeasUpToMaxCommented = createSelector(
  [(state: RootState) => state.text.ideas, (state: RootState) => state.text.comments],
  (ideas, comments) => {
    const ideaIdsWithComments = new Set(comments.map(comment => comment.ideaId));
    const maxIdeaIdWithComment = Math.max(...Array.from(ideaIdsWithComments));
    return ideas.filter(idea => idea.id <= maxIdeaIdWithComment);
  }
)

export const selectIdeaTrunkFromCurrentIdea = createSelector(
  [(state: RootState) => state.text.currentIdea, (state: RootState) => state.text.ideas],
  (currentIdea, ideas) => {
    let ideaTrunk = [];
    let currentId: number | null = currentIdea?.id ?? null;
    while (currentId) {
      const current = ideas.find(idea => idea.id === currentId);
      if (!current) {
        console.error("Error finding idea list! IdeaId: " + currentId)
        return ideaTrunk
      }
      ideaTrunk.unshift(current);
      currentId = current.parentIdeaId;
    }

    return ideaTrunk
  }
)

export const selectBranchesFromIdea = createSelector(
  [
    (state: RootState) => state.text.ideas,
    (state: RootState) => selectIdeaTrunkFromCurrentIdea(state),
    (_: RootState, parentId: number) => parentId
  ],
  (ideas, currentIdeaTrunk, parentId) => {
    const currentIdeaTrunkIds = new Set(currentIdeaTrunk.map(idea => idea.id));
    return ideas.filter(idea => idea.parentIdeaId === parentId && !currentIdeaTrunkIds.has(idea.id));
  }
)

export const { setCurrentIdea, changeBranch, addIdea, addComment, setLastTimeActive } = textSlice.actions;
export default textSlice.reducer;