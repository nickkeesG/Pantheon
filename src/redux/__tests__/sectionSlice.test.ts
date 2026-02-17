import { describe, expect, it } from "vitest";
import { IdeaType } from "../models";
import { selectSectionContentAsMarkdown } from "../sectionSlice";
import type { RootState } from "../store";

describe("selectSectionContentAsMarkdown", () => {
	// TODO Write more complex test cases
	it("should return markdown string for a given section ID", () => {
		const mockState = {
			idea: {
				ideas: {
					1: {
						id: 1,
						sectionId: 1,
						text: "Idea 1",
						type: IdeaType.User,
						parentIdeaId: null,
					},
					2: {
						id: 2,
						sectionId: 1,
						text: "Idea 2",
						type: IdeaType.User,
						parentIdeaId: 1,
					},
				},
			},
			section: {
				sections: {
					1: {
						id: 1,
						treeId: 1,
						parentSectionId: null,
						parentIdeaId: null,
						ideaIds: [1, 2],
					},
				},
			},
			ui: {
				activeSectionId: 1,
				creatingSection: false,
				activeIdeaIds: [1, 2],
			},
			comment: {
				comments: {},
			},
		} as unknown as RootState;

		const sectionId = 1;
		const markdown = selectSectionContentAsMarkdown(mockState, sectionId);

		expect(markdown).toBe("# Pantheon Context\n\n- Idea 1\n- Idea 2");
	});
});
