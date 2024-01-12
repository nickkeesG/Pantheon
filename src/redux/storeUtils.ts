import { Comment, Idea, IdeaExport, Page } from "./models";

/**
 * 
 * @param pages - The dictionary of all pages
 * @param ideaId - The ID of the idea
 * @returns The idea instance corresponding to the given id, or undefined if no such idea found
 */
export const getIdea = (pages: { [id: number]: Page }, ideaId: number): Idea | undefined => {
  for (const pageId in pages) {
    const foundIdea = pages[pageId].ideas.find(idea => idea.id === ideaId);
    if (foundIdea) return foundIdea;
  }
  return undefined;
}

/**
 * Retrieves all direct descendants of a given idea within the ideas array.
 * 
 * @param ideas - The array containing all ideas.
 * @param parentId - The ID of the parent idea.
 * @returns An array of ideas representing all the children of the given idea.
 */
export const getChildren = (ideas: Idea[], parentId: number): Idea[] => {
  return ideas.filter(idea => idea.parentIdeaId === parentId);
}

/**
 * Finds the most recent descendent of a given ancestor idea within the entire tree.
 * 
 * @param ideas - The array of all ideas.
 * @param ancestorIdeaId - The ID of the ancestor idea for which to find the descendent.
 * @returns The most recent descendent of the given ancestor idea.
 */
export const getMostRecentDescendent = (ideas: Idea[], ancestorIdeaId: number): Idea => {
  let mostRecentDescendent = ideas.find(idea => idea.id === ancestorIdeaId);
  if (!mostRecentDescendent) {
    throw new Error(`Ancestor idea with id ${ancestorIdeaId} not found`);
  }
  let queue = [mostRecentDescendent];
  while (queue.length > 0) {
    const currentIdea = queue.shift()!;
    const children = ideas.filter(idea => idea.parentIdeaId === currentIdea.id);
    queue.push(...children);
    if (currentIdea.id > mostRecentDescendent.id) {
      mostRecentDescendent = currentIdea;
    }
  }
  return mostRecentDescendent;
}

/**
 * Retrieves all ancestors of a given idea in the ideas array.
 * 
 * @param ideas - The array of all ideas.
 * @param lastIdeaId - The ID of the last idea in the chain of ancestors.
 * @returns An array of idea ids representing all the ancestors of the given idea.
 */
export const getAllAncestorIds = (ideas: Idea[], lastIdeaId: number): number[] => {
  // Finds all the ancestor IDs of a given idea
  console.debug("In getAllAncestorIds", ideas, lastIdeaId)
  let ancestorIds: number[] = [];
  let currentId: number | null = lastIdeaId;

  const findIdeaById = (id: number) => ideas.find(idea => idea.id === id);

  while (currentId) {
    const current = findIdeaById(currentId);
    if (!current) {
      console.error("Error finding idea list! IdeaId: " + currentId);
      break;
    }
    ancestorIds.unshift(current.id);
    currentId = current.parentIdeaId;
  }

  console.debug("Returning: " + ancestorIds)
  return ancestorIds;
};

/**
 * Retrieves all ideas since the most recent idea that has received comments.
 * 
 * @param ideas 
 * @param comments 
 * @returns 
 */
export const getIdeasSinceLastComment = (ideas: Idea[], ideaIds: number[], comments: Record<number, Comment>): Idea[] => {
  const ideaIdsWithComments = new Set(Object.values(comments).map(comment => comment.ideaId));
  const newestIdeaIdWithComments = Math.max(...Array.from(ideaIdsWithComments));
  return ideas.filter(idea => ideaIds.includes(idea.id) && idea.id > newestIdeaIdWithComments);
}

// TODO All this logic should probably be moved to another file
export function exploreBranch(ideas: Idea[], selectedIdea: Idea): IdeaExport[] {
  let ideaExports: IdeaExport[] = [];
  let openIdeas: Idea[] = []; // Ideas that have multiple children (that need to be followed up on)
  while (selectedIdea) {
    let newExport = {
      text: selectedIdea.text,
      incoming: false,
      outgoing: false
    }
    let children = getChildren(ideas, selectedIdea.id);
    if (children.length > 1) {
      newExport.outgoing = true;
      openIdeas.push(selectedIdea); //save the idea to follow up on later
    }
    ideaExports.push(newExport);

    if (children.length === 0) {
      break;
    } else {
      selectedIdea = children[0];
    }
  }

  // Now follow up on the open ideas
  for (let i = 0; i < openIdeas.length; i++) {
    let currentIdea = openIdeas[i];
    let newExport = {
      text: currentIdea.text,
      incoming: true,
      outgoing: false
    }
    ideaExports.push(newExport);
    let children = ideas.filter(idea => idea.parentIdeaId === currentIdea.id);
    for (let j = 1; j < children.length; j++) { //skip the first child, since we already explored it
      let newBranch = exploreBranch(ideas, children[j]); //
      ideaExports.push(...newBranch);
    }
  }

  return ideaExports;
}
