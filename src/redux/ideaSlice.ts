import {
	createSelector,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { type Idea, IdeaType } from "./models";
import type { RootState } from "./store";
import {
	getIdeasSinceLastComment,
	getMostRecentDescendent,
} from "./storeUtils";

export interface IdeaState {
	ideas: { [id: number]: Idea };
}

const initialState: IdeaState = {
	ideas: {},
};

const ideaSlice = createSlice({
	name: "idea",
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
			action.payload.forEach((ideaId) => {
				delete state.ideas[ideaId];
			});
		},
		setMentionToIdea(
			state,
			action: PayloadAction<{ ideaId: number; mention: string }>,
		) {
			const idea = state.ideas[action.payload.ideaId]!;
			idea.mention = action.payload.mention;
		},
		replaceSlice: (_, action: PayloadAction<IdeaState>) => action.payload,
		resetSlice: (_) => initialState,
	},
});

export const selectIdeasById = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(_: RootState, ideaIds: number[]) => ideaIds,
	],
	(ideas, ideaIds) => {
		const missingIdeas = ideaIds.filter((id) => !ideas[id]);
		if (missingIdeas.length > 0) {
			console.warn("Couldn't find some ideas", missingIdeas);
		}
		return ideaIds.map((id) => ideas[id]);
	},
);

export const selectIdeaBranches = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(state: RootState) => state.ui.activeIdeaIds,
		(_: RootState, parentIdeaId: number) => parentIdeaId,
	],
	(ideas, activeIdeaIds, parentIdeaId) => {
		return Object.values(ideas).filter(
			(idea) =>
				idea.parentIdeaId === parentIdeaId && !activeIdeaIds.includes(idea.id),
		);
	},
);

export const selectSectionBranchRootIdeas = createSelector(
	[
		(state: RootState) => state.section.sections,
		(state: RootState) => state.idea.ideas,
		(_: RootState, parentIdeaId: number) => parentIdeaId,
	],
	(sections, ideas, parentIdeaId) => {
		const childSections = Object.values(sections).filter(
			(section) => section.parentIdeaId === parentIdeaId,
		);
		const rootIdeaIds = childSections.map((section) => section.ideaIds[0]);
		return rootIdeaIds.map((id) => ideas[id]);
	},
);

export const selectActiveThoughtsEligibleForComments = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(state: RootState) => state.ui.activeIdeaIds,
		(state: RootState) => state.comment.comments,
	],
	(ideas, activeIdeaIds, comments) => {
		try {
			// filter out ideas that are not thoughts
			const activeBranchIdeas = activeIdeaIds
				.map((id) => ideas[id])
				.filter((idea) => idea.type === IdeaType.User);
			const activeBranchComments = Object.values(comments).filter((comment) =>
				activeIdeaIds.includes(comment.ideaId),
			);

			// filter out the root idea
			const nonRootIdeas = activeBranchIdeas.filter(
				(idea) =>
					idea.parentIdeaId !== null &&
					activeIdeaIds.includes(idea.parentIdeaId),
			);

			return getIdeasSinceLastComment(nonRootIdeas, activeBranchComments);
		} catch (e) {
			if (e instanceof TypeError) {
				// The active tree was probably deleted
				return [];
			} else {
				throw e;
			}
		}
	},
);

// TODO Active ideas cannot be found if the most recently active tree was deleted. This should be handled better (= deleting an active tree should reset activeIdeaIds etc to undefined.)

/**
 * Selects the active branch of ideas, including messages to and from 'Ask AI'.
 *
 * @param state - The root state of the application.
 * @returns An array of Idea objects representing the active branch, filtering out any missing ideas.
 */
export const selectActiveBranch = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(state: RootState) => state.ui.activeIdeaIds,
	],
	(ideas, activeIdeaIds) => {
		// Handle missing ideas
		return activeIdeaIds.map((id) => ideas[id]).filter((idea) => idea);
	},
);

/**
 * Selects the active thoughts (user-generated ideas) from the active branch.
 *
 * @param state - The root state of the application.
 * @returns An array of Idea objects representing the active thoughts, filtering out non-user ideas and missing ideas.
 */
export const selectActiveThoughts = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(state: RootState) => state.ui.activeIdeaIds,
	],
	(ideas, activeIdeaIds) => {
		return activeIdeaIds
			.map((id) => ideas[id])
			.filter((idea) => idea && idea.type === IdeaType.User);
	},
);

export const selectIdeasInTree = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(state: RootState) => state.section.sections,
		(_: RootState, treeId: number) => treeId,
	],
	(ideas, sections, treeId) => {
		const treeSections = Object.values(sections).filter(
			(section) => section.treeId === treeId,
		);
		const treeIdeas = treeSections.flatMap((section) =>
			section.ideaIds.map((id) => ideas[id]),
		);
		return treeIdeas;
	},
);

export const selectMostRecentIdeaInTree = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(state: RootState) => state.section.sections,
		(_: RootState, treeId: number) => treeId,
	],
	(ideas, sections, treeId) => {
		let mostRecentIdea = null;
		const treeSections = Object.values(sections).filter(
			(section) => section.treeId === treeId,
		);
		for (const section of treeSections) {
			if (section.ideaIds.length === 0) continue;
			const firstIdea = section.ideaIds[0];
			const sectionIdeas = section.ideaIds.map((id) => ideas[id]);
			const mostRecentIdeaInSection = getMostRecentDescendent(
				sectionIdeas,
				firstIdea,
			);
			if (!mostRecentIdea || mostRecentIdeaInSection.id > mostRecentIdea.id) {
				mostRecentIdea = mostRecentIdeaInSection;
			}
		}
		return mostRecentIdea;
	},
);

export const {
	addIdea,
	updateIdea,
	deleteIdeas,
	setMentionToIdea,
	replaceSlice: replaceIdeaSlice,
	resetSlice: resetIdeaSlice,
} = ideaSlice.actions;
export const initialIdeaState = initialState;
export default ideaSlice.reducer;
