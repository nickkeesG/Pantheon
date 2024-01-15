import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Idea, Page } from './models';


export interface PageState {
  pages: { [key: number]: Page };
}

const initialState: PageState = {
  pages: {
    0: {
      id: 0,
      parentPageId: null,
      parentIdeaId: null,
      ideaIds: []
    }
  }
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    addPage(state, action: PayloadAction<Page>) {
      const page = action.payload;
      state.pages[page.id] = page;
    },
    deletePage(state, action: PayloadAction<number>) {
      delete state.pages[action.payload];
    },
    addIdeaToParentPage(state, action: PayloadAction<Idea>) {
      const page = state.pages[action.payload.pageId];
      page.ideaIds.push(action.payload.id);
    },
    replaceSlice(state, action: PayloadAction<PageState>) {
      return action.payload;
    }
  },
});

export const { addPage, deletePage, addIdeaToParentPage, replaceSlice } = pageSlice.actions;
export default pageSlice.reducer;