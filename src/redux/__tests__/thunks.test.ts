import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IdeaType } from "../models";
import type { AppDispatch } from "../store";
import { rootReducer } from "../store";
import { importAppState } from "../thunks";

function createTestStore() {
	const store = configureStore({ reducer: rootReducer });
	return { ...store, dispatch: store.dispatch as AppDispatch };
}

function makeExportedState(overrides: Record<string, unknown> = {}) {
	return {
		tree: { trees: { 1: { id: 1, sectionIds: [1] } } },
		section: {
			sections: {
				1: {
					id: 1,
					treeId: 1,
					parentSectionId: null,
					parentIdeaId: null,
					ideaIds: [1],
				},
			},
		},
		idea: {
			ideas: {
				1: {
					id: 1,
					type: IdeaType.User,
					sectionId: 1,
					parentIdeaId: null,
					text: "Idea 1",
				},
			},
		},
		comment: { comments: {} },
		daemon: {
			chatDaemons: [],
			baseDaemon: { mainTemplate: "", ideaTemplate: "", temperature: 0.7 },
			instructDaemon: { systemPrompt: "", userPrompt: "" },
		},
		config: {
			openAI: {
				ApiKey: "",
				OrgId: "",
				baseModel: "davinci-002",
				chatModel: "gpt-4o",
			},
		},
		...overrides,
	};
}

describe("importAppState thunk", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(console, "info").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should import app state and update the state correctly", () => {
		const store = createTestStore();
		const exported = makeExportedState();
		const jsonString = JSON.stringify(exported);

		let state = store.getState();
		expect(state).not.toEqual(exported);

		store.dispatch(importAppState(jsonString));

		state = store.getState();
		expect(state.tree).toEqual(exported.tree);
		expect(state.section).toEqual(exported.section);
		expect(state.idea).toEqual(exported.idea);
		expect(state.comment).toEqual(exported.comment);
		expect(state.daemon).toEqual(exported.daemon);
		expect(state.config).toEqual(exported.config);
		expect(state.ui.activeTreeId).toBe(1);
		expect(state.ui.activeSectionId).toBe(1);
		expect(state.ui.activeIdeaIds).toEqual([1]);
	});

	it("should leave state unchanged when given invalid JSON", () => {
		const store = createTestStore();
		const stateBefore = store.getState();

		store.dispatch(importAppState("not valid json {{{"));

		const stateAfter = store.getState();
		expect(stateAfter.tree).toEqual(stateBefore.tree);
		expect(stateAfter.section).toEqual(stateBefore.section);
		expect(stateAfter.idea).toEqual(stateBefore.idea);
		expect(stateAfter.comment).toEqual(stateBefore.comment);
		expect(stateAfter.daemon).toEqual(stateBefore.daemon);
		expect(stateAfter.config).toEqual(stateBefore.config);
		expect(stateAfter.ui.activeTreeId).toBe(stateBefore.ui.activeTreeId);
	});

	it("should leave state unchanged when slices are missing", () => {
		const store = createTestStore();
		const stateBefore = store.getState();
		const partialState = {
			tree: { trees: { 1: { id: 1, sectionIds: [1] } } },
			section: {
				sections: {
					1: {
						id: 1,
						treeId: 1,
						parentSectionId: null,
						parentIdeaId: null,
						ideaIds: [],
					},
				},
			},
		};

		store.dispatch(importAppState(JSON.stringify(partialState)));

		expect(store.getState().tree).toEqual(stateBefore.tree);
		expect(store.getState().section).toEqual(stateBefore.section);
		expect(store.getState().idea).toEqual(stateBefore.idea);
	});

	it("should leave state unchanged when ideas are empty", () => {
		const store = createTestStore();
		const stateBefore = store.getState();
		const exported = makeExportedState({ idea: { ideas: {} } });

		store.dispatch(importAppState(JSON.stringify(exported)));

		expect(store.getState().tree).toEqual(stateBefore.tree);
		expect(store.getState().section).toEqual(stateBefore.section);
		expect(store.getState().idea).toEqual(stateBefore.idea);
	});

	it("should set active IDs based on the most recent idea in a chain", () => {
		const store = createTestStore();
		const exported = makeExportedState({
			tree: { trees: { 1: { id: 1, sectionIds: [1] } } },
			section: {
				sections: {
					1: {
						id: 1,
						treeId: 1,
						parentSectionId: null,
						parentIdeaId: null,
						ideaIds: [1, 2, 3],
					},
				},
			},
			idea: {
				ideas: {
					1: {
						id: 1,
						type: IdeaType.User,
						sectionId: 1,
						parentIdeaId: null,
						text: "Root",
					},
					2: {
						id: 2,
						type: IdeaType.User,
						sectionId: 1,
						parentIdeaId: 1,
						text: "Child",
					},
					3: {
						id: 3,
						type: IdeaType.User,
						sectionId: 1,
						parentIdeaId: 2,
						text: "Grandchild",
					},
				},
			},
		});

		store.dispatch(importAppState(JSON.stringify(exported)));

		const state = store.getState();
		expect(state.ui.activeTreeId).toBe(1);
		expect(state.ui.activeSectionId).toBe(1);
		expect(state.ui.activeIdeaIds).toEqual([1, 2, 3]);
	});

	it("should round-trip: imported state can be re-exported identically", () => {
		const store = createTestStore();
		const exported = makeExportedState();

		store.dispatch(importAppState(JSON.stringify(exported)));

		const state = store.getState();
		const reExported = {
			tree: state.tree,
			section: state.section,
			idea: state.idea,
			comment: state.comment,
			daemon: state.daemon,
			config: state.config,
		};

		expect(reExported).toEqual(exported);
	});
});
