import { addIdea, selectIdeasById } from "./ideaSlice";
import { Idea, Page } from "./models";
import { AppThunk } from './store';
import { getAllAncestorIds, getChildren, getMostRecentDescendent } from "./storeUtils";
import { addIdeaToParentPage, addPage, deletePage } from "./pageSlice";
import { setActiveIdeaIds, setActivePageId } from "./uiSlice";


export const switchBranch = (parentIdea: Idea, moveForward: boolean): AppThunk => (dispatch, getState) => {
  const state = getState();
  const page = state.page.pages[parentIdea.pageId];
  const ideas = selectIdeasById(state, page.ideaIds);
  const childIdeas = getChildren(ideas, parentIdea.id);
  const currentChild = ideas.find(idea => idea.parentIdeaId === parentIdea.id && state.ui.activeIdeaIds.includes(idea.id));
  let newCurrentIdea: Idea;
  if (currentChild) {
    const currentIndex = childIdeas.findIndex(idea => idea.id === currentChild.id);
    const newChild = moveForward
      ? childIdeas[(currentIndex + 1) % childIdeas.length]
      : childIdeas[(currentIndex - 1 + childIdeas.length) % childIdeas.length];
    newCurrentIdea = getMostRecentDescendent(ideas, newChild.id);
  } else {
    // User was likely adding a new branch but changed their mind
    newCurrentIdea = getMostRecentDescendent(ideas, parentIdea.id);
  }

  dispatch(setActiveIdeaIds(getAllAncestorIds(ideas, newCurrentIdea.id)));
};

export const createPage = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const newPageId = Date.now();
  const newPage: Page = {
    id: newPageId,
    parentPageId: state.ui.activePageId,
    parentIdeaId: state.ui.activeIdeaIds[state.ui.activeIdeaIds.length - 1],
    ideaIds: []
  };

  dispatch(addPage(newPage));
  dispatch(setActivePageId(newPageId));
  dispatch(setActiveIdeaIds([]));
};


export const navigateToParentPage = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const activePage = state.page.pages[state.ui.activePageId];
  if (activePage.parentPageId !== null && activePage.parentIdeaId !== null) {
    const parentPage = state.page.pages[activePage.parentPageId];
    const parentPageIdeas = selectIdeasById(state, parentPage.ideaIds);
    const newActiveIdea = getMostRecentDescendent(parentPageIdeas, activePage.parentIdeaId);
    const newActiveIdeaIds = getAllAncestorIds(parentPageIdeas, newActiveIdea.id);

    dispatch(setActivePageId(parentPage.id));
    dispatch(setActiveIdeaIds(newActiveIdeaIds));

    if (activePage.ideaIds.length === 0) {
      // User cancelled creating a new page
      dispatch(deletePage(activePage.id))
    }
  }
};

export const navigateToChildPage = (rootIdea: Idea): AppThunk => (dispatch, getState) => {
  const state = getState();
  const childPage = state.page.pages[rootIdea.pageId];
  const ideaIds = childPage.ideaIds;
  const allIdeas = state.idea.ideas;
  const ideas = ideaIds.map(id => allIdeas[id]);
  const newCurrentIdea = getMostRecentDescendent(ideas, rootIdea.id);
  const newActiveIdeaIds = getAllAncestorIds(ideas, newCurrentIdea.id);

  dispatch(setActivePageId(childPage.id));
  dispatch(setActiveIdeaIds(newActiveIdeaIds));
};

export const createIdea = (text: string): AppThunk => (dispatch, getState) => {
  const state = getState();
  const id = Date.now();
  const pageId = state.ui.activePageId;
  const parentIdeaId = state.ui.activeIdeaIds[state.ui.activeIdeaIds.length - 1];
  const newIdea: Idea = {
    id,
    pageId,
    parentIdeaId,
    text,
    textTokens: [],
    tokenSurprisals: []
  }
  const newActiveIdeaIds = [...state.ui.activeIdeaIds, id];

  dispatch(addIdea(newIdea));
  dispatch(addIdeaToParentPage(newIdea));
  dispatch(setActiveIdeaIds(newActiveIdeaIds))
}