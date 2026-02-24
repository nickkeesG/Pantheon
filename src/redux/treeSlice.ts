import {
	createSelector,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { selectMostRecentIdeaInTree } from "./ideaSlice";
import type { Section, Tree } from "./models";
import type { RootState } from "./store";

export interface TreeState {
	trees: { [key: number]: Tree };
}

const initialState: TreeState = {
	trees: {
		0: {
			id: 0,
			sectionIds: [0],
		},
	},
};

const treeSlice = createSlice({
	name: "tree",
	initialState,
	reducers: {
		addTree(state, action: PayloadAction<Tree>) {
			const tree = action.payload;
			state.trees[tree.id] = tree;
		},
		renameTree(
			state,
			action: PayloadAction<{ treeId: number; newName: string }>,
		) {
			const tree = state.trees[action.payload.treeId];
			if (tree) {
				tree.name = action.payload.newName;
			}
		},
		deleteTree(state, action: PayloadAction<number>) {
			delete state.trees[action.payload];
		},
		addSectionToTree(state, action: PayloadAction<Section>) {
			const tree = state.trees[action.payload.treeId];
			tree.sectionIds.push(action.payload.id);
		},
		updateTree(state, action: PayloadAction<Tree>) {
			const tree = action.payload;
			state.trees[tree.id] = tree;
		},
		replaceSlice: (_, action: PayloadAction<TreeState>) => action.payload,
		resetSlice: (_) => initialState,
	},
});

export const selectTreesWithMostRecentEdit = createSelector(
	[(state: RootState) => state.tree.trees, (state: RootState) => state],
	(trees, state) => {
		return Object.values(trees)
			.map((tree) => {
				const mostRecentIdea = selectMostRecentIdeaInTree(state, tree.id);
				return {
					...tree,
					mostRecentEdit: mostRecentIdea
						? new Date(mostRecentIdea.id)
						: new Date(tree.id),
				};
			})
			.sort((a, b) => b.mostRecentEdit.getTime() - a.mostRecentEdit.getTime());
	},
);

export const {
	addTree,
	renameTree,
	deleteTree,
	addSectionToTree,
	updateTree,
	replaceSlice: replaceTreeSlice,
	resetSlice: resetTreeSlice,
} = treeSlice.actions;
export const initialTreeState = initialState;
export default treeSlice.reducer;
