import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IncomingComment {
	daemonName: string;
	ideaId: number;
	isRight: boolean; // Is the comment going to be on the right column
}

export interface UIState {
	lastTimeActive: number;
	activeTreeId: number;
	activeSectionId: number;
	activeIdeaIds: number[];
	creatingSection?: boolean;
	incomingComment?: IncomingComment; // Comment currently being generated
}

const initialState: UIState = {
	lastTimeActive: Date.now(),
	activeTreeId: 0,
	activeSectionId: 0,
	activeIdeaIds: [],
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		setLastTimeActive(state) {
			state.lastTimeActive = Date.now();
		},
		setActiveTreeId(state, action: PayloadAction<number>) {
			state.activeTreeId = action.payload;
		},
		setActiveSectionId(state, action: PayloadAction<number>) {
			state.activeSectionId = action.payload;
		},
		setActiveIdeaIds(state, action: PayloadAction<number[]>) {
			state.activeIdeaIds = action.payload;
		},
		setActiveView(
			state,
			action: PayloadAction<{
				treeId: number;
				sectionId: number;
				ideaIds: number[];
			}>,
		) {
			state.activeTreeId = action.payload.treeId;
			state.activeSectionId = action.payload.sectionId;
			state.activeIdeaIds = action.payload.ideaIds;
			state.creatingSection = false;
		},
		setCreatingSection(state, action: PayloadAction<boolean>) {
			state.creatingSection = action.payload;
		},
		createBranch(state, action: PayloadAction<number>) {
			const ideaIndex = state.activeIdeaIds.indexOf(action.payload);
			if (ideaIndex >= 0) {
				state.activeIdeaIds = state.activeIdeaIds.slice(0, ideaIndex + 1);
			}
		},
		setIncomingComment(
			state,
			action: PayloadAction<{
				daemonName?: string;
				ideaId?: number;
				isRight?: boolean;
			}>,
		) {
			if (
				action.payload.daemonName &&
				action.payload.ideaId &&
				action.payload.isRight !== undefined
			) {
				state.incomingComment = {
					daemonName: action.payload.daemonName,
					ideaId: action.payload.ideaId,
					isRight: action.payload.isRight,
				};
			} else {
				state.incomingComment = undefined;
			}
		},
		resetUiSlice: (state) => initialState,
	},
});

export const {
	setLastTimeActive,
	setActiveTreeId,
	setActiveSectionId,
	setActiveIdeaIds,
	setActiveView,
	setCreatingSection,
	createBranch,
	setIncomingComment,
	resetUiSlice,
} = uiSlice.actions;
export const initialUiState = initialState;
export default uiSlice.reducer;
