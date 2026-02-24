import {
	createSelector,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import type { Idea, Section } from "./models";
import type { RootState } from "./store";
import { prepareIdeasForExport } from "./storeUtils";

export interface SectionState {
	sections: { [key: number]: Section };
}

const initialState: SectionState = {
	sections: {
		0: {
			id: 0,
			treeId: 0,
			parentSectionId: null,
			parentIdeaId: null,
			ideaIds: [],
		},
	},
};

const sectionSlice = createSlice({
	name: "section",
	initialState,
	reducers: {
		addSection(state, action: PayloadAction<Section>) {
			const section = action.payload;
			state.sections[section.id] = section;
		},
		deleteSection(state, action: PayloadAction<number>) {
			delete state.sections[action.payload];
		},
		deleteSections(state, action: PayloadAction<number[]>) {
			action.payload.forEach((sectionId) => {
				delete state.sections[sectionId];
			});
		},
		addIdeaToParentSection(state, action: PayloadAction<Idea>) {
			const section = state.sections[action.payload.sectionId];
			section.ideaIds.push(action.payload.id);
		},
		replaceSlice: (_, action: PayloadAction<SectionState>) => action.payload,
		resetSlice: (_) => initialState,
	},
});

export const selectSectionContentAsMarkdown = createSelector(
	[
		(state: RootState) => state.idea.ideas,
		(_: RootState, sectionId: number) => sectionId,
	],
	(ideas, sectionId) => {
		const sectionIdeas = Object.values(ideas).filter(
			(idea) => idea.sectionId === sectionId,
		);
		if (sectionIdeas.length === 0) return "";
		const rootIdea = sectionIdeas[0];
		const ideaExports = prepareIdeasForExport(sectionIdeas, rootIdea);
		let markdown = "# Pantheon Context\n";
		ideaExports.forEach((idea) => {
			if (idea.incoming) {
				markdown += `\n---`;
				markdown += `\n- (${idea.text})`;
			} else {
				markdown += `\n- ${idea.text}`;
				if (idea.outgoing) {
					markdown += " ->";
				}
			}
		});

		return markdown;
	},
);

export const {
	addSection,
	deleteSection,
	deleteSections,
	addIdeaToParentSection,
	replaceSlice: replaceSectionSlice,
	resetSlice: resetSectionSlice,
} = sectionSlice.actions;
export const initialSectionState = initialState;
export default sectionSlice.reducer;
