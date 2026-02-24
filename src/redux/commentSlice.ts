import {
	createSelector,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import type { ChainOfThoughtType, Comment } from "./models";
import type { RootState } from "./store";

export interface CommentState {
	comments: { [id: number]: Comment };
}

const initialState: CommentState = {
	comments: {},
};

const commentSlice = createSlice({
	name: "comment",
	initialState,
	reducers: {
		addComment(
			state,
			action: PayloadAction<{
				ideaId: number;
				text: string;
				chainOfThought: [ChainOfThoughtType, string][];
				daemonName: string;
				daemonType: string;
			}>,
		) {
			const newId = Date.now();
			const newComment: Comment = {
				id: newId,
				ideaId: action.payload.ideaId,
				text: action.payload.text,
				chainOfThought: action.payload.chainOfThought,
				daemonName: action.payload.daemonName,
				daemonType: action.payload.daemonType,
				userApproved: false,
			};
			state.comments[newId] = newComment;
		},
		approveComment(state, action: PayloadAction<number>) {
			const comment = state.comments[action.payload];
			if (!comment) console.error("Error fetching comment " + action.payload);
			else comment.userApproved = true;
		},
		removeComment(state, action: PayloadAction<number>) {
			delete state.comments[action.payload];
		},
		replaceSlice: (_, action: PayloadAction<CommentState>) => action.payload,
		resetSlice: (_) => initialState,
	},
});

export const selectCommentsForIdea = createSelector(
	[
		(state: RootState) => state.comment.comments,
		(_: RootState, ideaId: number) => ideaId,
		(_: RootState, __: number, daemonType: string = "") => daemonType,
	],
	(comments, ideaId, daemonType) => {
		// Added backwards compatibility for old daemon types
		let filterCondition: (comment: Comment) => boolean;

		if (daemonType === "left") {
			filterCondition = (comment: Comment) =>
				comment.daemonType === "left" || comment.daemonType === "base";
		} else if (daemonType === "right") {
			filterCondition = (comment: Comment) =>
				comment.daemonType === "right" || comment.daemonType === "chat";
		} else {
			filterCondition = (comment: Comment) => comment.daemonType === daemonType;
		}

		return Object.values(comments).filter(
			(comment: Comment) =>
				comment.ideaId === ideaId && filterCondition(comment),
		);
	},
);

export const selectCommentsGroupedByIdeaIds = createSelector(
	[
		(state: RootState) => state.comment.comments,
		(_: RootState, ideaIds: number[]) => ideaIds,
		(_: RootState, __: number[], daemonType: string = "") => daemonType,
	],
	(comments, ideaIds, daemonType) => {
		return ideaIds.reduce(
			(acc, ideaId) => {
				acc[ideaId] = Object.values(comments).filter(
					(comment: Comment) =>
						comment.ideaId === ideaId &&
						(daemonType === "" || comment.daemonType === daemonType),
				);
				return acc;
			},
			{} as Record<number, Comment[]>,
		);
	},
);

export const selectMostRecentCommentForCurrentBranch = createSelector(
	[
		(state: RootState) => state.comment.comments,
		(state: RootState) => state.ui.activeIdeaIds,
	],
	(comments, activeIdeaIds) => {
		const commentsForActiveIdeas = Object.values(comments).filter(
			(comment: Comment) => activeIdeaIds.includes(comment.ideaId),
		);
		const sortedComments = commentsForActiveIdeas.sort(
			(a, b) => b.ideaId - a.ideaId,
		);
		return sortedComments.length > 0 ? sortedComments[0] : null;
	},
);

export const {
	addComment,
	approveComment,
	removeComment,
	replaceSlice: replaceCommentSlice,
	resetSlice: resetCommentSlice,
} = commentSlice.actions;
export const initialCommentState = initialState;
export default commentSlice.reducer;
