import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page, Tree } from './models';

export interface TreeState {
  trees: { [key: number]: Tree };
}

const initialState: TreeState = {
  trees: {
    0: {
      id: 0,
      pageIds: [0]
    }
  }
};

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    addTree(state, action: PayloadAction<Tree>) {
      const tree = action.payload;
      state.trees[tree.id] = tree;
    },
    deleteTree(state, action: PayloadAction<number>) {
      delete state.trees[action.payload];
    },
    addPageToTree(state, action: PayloadAction<Page>) {
      const tree = state.trees[action.payload.treeId];
      tree.pageIds.push(action.payload.id);
    },
    updateTree(state, action: PayloadAction<Tree>) {
      const tree = action.payload;
      state.trees[tree.id] = tree;
    }
  },
});

export const { addTree, deleteTree, addPageToTree, updateTree } = treeSlice.actions;
export default treeSlice.reducer;
