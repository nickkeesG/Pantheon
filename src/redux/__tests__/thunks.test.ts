import { importAppState } from '../thunks';
import { configureStore } from '@reduxjs/toolkit';
import { AppDispatch, rootReducer } from '../store';

describe('importAppState thunk', () => {
  it('should import app state and update the state correctly', async () => {
    const store = configureStore({ reducer: rootReducer });

    const exportedState = {
      tree: { trees: { 1: { id: 1, sectionIds: [1] } } },
      section: { sections: { 1: { id: 1, treeId: 1, parentSectionId: null, parentIdeaId: null, ideaIds: [1] } } },
      idea: { ideas: { 1: { id: 1, sectionId: 1, parentIdeaId: null, text: 'Idea 1', isUser: true } } },
      comment: { comments: { 1: { id: 1, text: 'Sample comment', author: 'User1' } } },
      daemon: { chatDaemons: [], baseDaemon: { id: 1, name: 'BaseDaemon' }, instructDaemon: { id: 2, name: 'InstructDaemon' } },
      config: { openAIKey: 'sample-key', openAIOrgId: 'sample-org-id', baseModel: 'base-model', chatModel: 'chat-model', isSynchronizerActive: true }
    }
    const jsonString = JSON.stringify(exportedState);

    let state = store.getState();
    expect(state).not.toEqual(exportedState);

    const dispatch: AppDispatch = store.dispatch as AppDispatch;
    dispatch(importAppState(jsonString));

    state = store.getState();
    expect(state.tree).toEqual(exportedState.tree);
    expect(state.section).toEqual(exportedState.section);
    expect(state.idea).toEqual(exportedState.idea);
    expect(state.comment).toEqual(exportedState.comment);
    expect(state.daemon).toEqual(exportedState.daemon);
    expect(state.config).toEqual(exportedState.config);
    expect(state.ui.activeTreeId).toBe(1);
    expect(state.ui.activeSectionId).toBe(1);
    expect(state.ui.activeIdeaIds).toEqual([1]);
  });
});