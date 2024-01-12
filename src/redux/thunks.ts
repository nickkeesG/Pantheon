import { Idea, Page } from "./models";
import { AppThunk } from './store';
import { getAllAncestorIds, getChildren, getIdea, getMostRecentDescendent } from "./storeUtils";
import { addIdea, addPage, deletePage } from "./textSlice";
import { setActiveIdeaIds, setActivePageId } from "./uiSlice";


export const switchBranch = (parentIdea: Idea, moveForward: boolean): AppThunk => (dispatch, getState) => {
  const state = getState();
  const page = state.text.pages[parentIdea.pageId];
  const childIdeas = getChildren(page.ideas, parentIdea.id);
  const currentChild = page.ideas.find(idea => idea.parentIdeaId === parentIdea.id && state.ui.activeIdeaIds.includes(idea.id));
  let newCurrentIdea: Idea;
  if (currentChild) {
    const currentIndex = childIdeas.findIndex(idea => idea.id === currentChild.id);
    const newChild = moveForward
      ? childIdeas[(currentIndex + 1) % childIdeas.length]
      : childIdeas[(currentIndex - 1 + childIdeas.length) % childIdeas.length];
    newCurrentIdea = getMostRecentDescendent(page.ideas, newChild.id);
  } else {
    // User was likely adding a new branch but changed their mind
    newCurrentIdea = getMostRecentDescendent(page.ideas, parentIdea.id);
  }

  dispatch(setActiveIdeaIds(getAllAncestorIds(page.ideas, newCurrentIdea.id)));
};

export const createPage = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const newPageId = Date.now();
  const newPage: Page = {
    id: newPageId,
    parentPageId: state.ui.activePageId,
    parentIdeaId: state.ui.activeIdeaIds[state.ui.activeIdeaIds.length - 1],
    ideas: []
  };

  dispatch(addPage(newPage));
  dispatch(setActivePageId(newPageId));
  dispatch(setActiveIdeaIds([]));
};


export const navigateToParentPage = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const activePage = state.text.pages[state.ui.activePageId];
  if (activePage.parentPageId !== null) {
    const parentPage = state.text.pages[activePage.parentPageId];
    const parentIdea = getIdea(state.text.pages, activePage.parentIdeaId!)!;
    const newActiveIdea = getMostRecentDescendent(parentPage.ideas, parentIdea.id);
    const newActiveIdeaIds = getAllAncestorIds(parentPage.ideas, newActiveIdea.id);

    dispatch(setActivePageId(parentPage.id));
    dispatch(setActiveIdeaIds(newActiveIdeaIds));

    if (activePage.ideas.length === 0) {
      // User cancelled creating a new page
      dispatch(deletePage(activePage.id))
    }
  }
};

export const navigateToChildPage = (rootIdea: Idea): AppThunk => (dispatch, getState) => {
  const state = getState();
  const childPage = state.text.pages[rootIdea.pageId];
  const newCurrentIdea = getMostRecentDescendent(childPage.ideas, rootIdea.id);
  const newActiveIdeaIds = getAllAncestorIds(childPage.ideas, newCurrentIdea.id);

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
  dispatch(setActiveIdeaIds(newActiveIdeaIds))
}