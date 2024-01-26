import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UIState {
  lastTimeActive: number;
  activeTreeId: number;
  activeSectionId: number;
  activeIdeaIds: number[];
}

const initialState: UIState = {
  lastTimeActive: Date.now(),
  activeTreeId: 0,
  activeSectionId: 0,
  activeIdeaIds: []
}

const uiSlice = createSlice({
  name: 'ui',
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
    createBranch(state, action: PayloadAction<number>) {
      const ideaIndex = state.activeIdeaIds.indexOf(action.payload);
      if (ideaIndex >= 0) {
        state.activeIdeaIds = state.activeIdeaIds.slice(0, ideaIndex + 1);
      }
    },
    resetUiSlice: (state) => initialState
  }
})


export const { setLastTimeActive, setActiveTreeId, setActiveSectionId, setActiveIdeaIds, createBranch, resetUiSlice } = uiSlice.actions;
export const initialUiState = initialState;
export default uiSlice.reducer;