import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea, Section } from './models';


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
      ideaIds: []
    }
  }
};

const sectionSlice = createSlice({
  name: 'section',
  initialState,
  reducers: {
    addSection(state, action: PayloadAction<Section>) {
      const section = action.payload;
      state.sections[section.id] = section;
    },
    deleteSection(state, action: PayloadAction<number>) {
      delete state.sections[action.payload];
    },
    addIdeaToParentSection(state, action: PayloadAction<Idea>) {
      const section = state.sections[action.payload.sectionId];
      section.ideaIds.push(action.payload.id);
    },
    replaceSlice: (_, action: PayloadAction<SectionState>) => action.payload,
    resetSlice: (_) => initialState
  },
});

export const { addSection, deleteSection, addIdeaToParentSection, replaceSlice: replaceSectionSlice, resetSlice: resetSectionSlice } = sectionSlice.actions;
export const initialSectionState = initialState;
export default sectionSlice.reducer;