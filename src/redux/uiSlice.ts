import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UIState {
  lastTimeActive: number;
  activePageId: number;
  activeIdeaIds: number[];
}

const initialState: UIState = {
  lastTimeActive: Date.now(),
  activePageId: 0,
  activeIdeaIds: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLastTimeActive(state) {
      state.lastTimeActive = Date.now();
    },
    setActivePageId(state, action: PayloadAction<number>) {
      state.activePageId = action.payload;
    },
    setActiveIdeaIds(state, action: PayloadAction<number[]>) {
      state.activeIdeaIds = action.payload;
    },
    createBranch(state, action: PayloadAction<number>) {
      const ideaIndex = state.activeIdeaIds.indexOf(action.payload);
      if (ideaIndex >= 0) {
        state.activeIdeaIds = state.activeIdeaIds.slice(0, ideaIndex + 1);
      }
    }
  }
})


export const { setLastTimeActive, setActivePageId, setActiveIdeaIds, createBranch } = uiSlice.actions;
export default uiSlice.reducer;