import { resetTreeSlice, addPageToTree } from './treeSlice';
import { PageState, replaceSlice as replacePageSlice, resetPageSlice, addIdeaToParentPage, addPage, deletePage } from "./pageSlice";
import { IdeaState, replaceSlice as replaceIdeaSlice, resetIdeaSlice, addIdea, selectIdeasById } from "./ideaSlice";
import { CommentState, replaceSlice as replaceCommentSlice, resetCommentSlice } from "./commentSlice";
import { resetDaemonSlice } from "./daemonSlice";
import { clearErrors } from './errorSlice';
import { resetConfigSlice } from './configSlice';
import { setActiveIdeaIds, setActivePageId, resetUiSlice } from "./uiSlice";
import { Idea, Page } from "./models";
import { AppThunk } from './store';
import { getAllAncestorIds, getChildren, getMostRecentDescendent } from "./storeUtils";


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
    treeId: state.ui.activeTreeId,
    parentPageId: state.ui.activePageId,
    parentIdeaId: state.ui.activeIdeaIds[state.ui.activeIdeaIds.length - 1],
    ideaIds: []
  };

  dispatch(addPage(newPage));
  dispatch(addPageToTree(newPage));
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

export const createIdea = (text: string, isUser: boolean = true): AppThunk => (dispatch, getState) => {
  const state = getState();
  const id = Date.now();
  const pageId = state.ui.activePageId;
  const parentIdeaId = state.ui.activeIdeaIds[state.ui.activeIdeaIds.length - 1];
  const newIdea: Idea = {
    id,
    isUser,
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

export const importTree = (json: string): AppThunk => (dispatch, getState) => {
  try {
    const importedState = JSON.parse(json) as { page: PageState; idea: IdeaState; comment: CommentState };
    console.debug(importedState)
    dispatch(replacePageSlice(importedState.page));
    dispatch(replaceIdeaSlice(importedState.idea));
    dispatch(replaceCommentSlice(importedState.comment));
    const allImportedIdeas = Object.values(importedState.idea.ideas);
    const mostRecentIdea = allImportedIdeas.reduce((prev, current) => (prev.id > current.id) ? prev : current);
    console.debug(allImportedIdeas, mostRecentIdea)
    dispatch(setActivePageId(mostRecentIdea.pageId));
    dispatch(setActiveIdeaIds(getAllAncestorIds(allImportedIdeas, mostRecentIdea.id)));
    console.info("Import finished successfully")
    // TODO Notify the user that the import was successful
  } catch (error) {
    console.error('Error parsing the imported file', error);
  }
}

export const resetState = (): AppThunk => (dispatch, getState) => {
  console.info("Resetting app state");
  dispatch(resetTreeSlice());
  dispatch(resetPageSlice());
  dispatch(resetIdeaSlice());
  dispatch(resetCommentSlice());
  dispatch(resetDaemonSlice());
  dispatch(resetConfigSlice());
  dispatch(resetUiSlice());
  dispatch(clearErrors());
}