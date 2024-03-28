import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Comment } from './models';


export interface CommentState {
  comments: { [id: number]: Comment };
}

const initialState: CommentState = {
  comments: {}
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<{ ideaId: number, text: string, daemonName: string, daemonType: string }>) {
      const { ideaId, text, daemonName, daemonType } = action.payload;
      const allowedDaemonTypes = ['left', 'right'];
      
      if (!allowedDaemonTypes.includes(daemonType)) {
        console.error(`Invalid daemonType: ${daemonType}. Must be either 'left' or 'right'.`);
        return;
      }
      
      const newId = Date.now();
      const newComment: Comment = {
        id: newId,
        ideaId,
        text,
        daemonName,
        daemonType,
        userApproved: false
      };
      state.comments[newId] = newComment;
    },
    approveComment(state, action: PayloadAction<number>) {
      const comment = state.comments[action.payload]
      if (!comment) console.error("Error fetching comment " + action.payload);
      else comment.userApproved = true;
    },
    removeComment(state, action: PayloadAction<number>) {
      delete state.comments[action.payload];
    },
    replaceSlice: (_, action: PayloadAction<CommentState>) => action.payload,
    resetSlice: (_) => initialState
  },
});


export const selectCommentsForIdea = createSelector(
  [
    (state: RootState) => state.comment.comments,
    (_: RootState, ideaId: number) => ideaId,
    (_: RootState, __: number, daemonType: string = '') => daemonType
  ],
  (comments, ideaId, daemonType) => Object.values(comments).filter((comment: Comment) => comment.ideaId === ideaId && (daemonType === '' || comment.daemonType === daemonType))
);

export const selectCommentsGroupedByIdeaIds = createSelector(
  [
    (state: RootState) => state.comment.comments,
    (_: RootState, ideaIds: number[]) => ideaIds,
    (_: RootState, __: number[], daemonType: string = '') => daemonType
  ],
  (comments, ideaIds, daemonType) => {
    return ideaIds.reduce((acc, ideaId) => {
      acc[ideaId] = Object.values(comments).filter((comment: Comment) => comment.ideaId === ideaId && (daemonType === '' || comment.daemonType === daemonType));
      return acc;
    }, {} as Record<number, Comment[]>);
  }
);


export const { addComment, approveComment, removeComment, replaceSlice: replaceCommentSlice, resetSlice: resetCommentSlice } = commentSlice.actions;
export const initialCommentState = initialState;
export default commentSlice.reducer;