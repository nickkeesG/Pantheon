import type { ChatDaemonConfig, Comment, Idea, IdeaExport } from "./models";

/**
 * Retrieves all direct descendants of a given idea within the ideas array.
 *
 * @param ideas - The array containing all ideas.
 * @param parentId - The ID of the parent idea.
 * @returns An array of ideas representing all the children of the given idea.
 */
export const getChildren = (ideas: Idea[], parentId: number): Idea[] => {
	return ideas.filter((idea) => idea.parentIdeaId === parentId);
};

/**
 * Finds the most recent descendent of a given ancestor idea within the entire tree.
 *
 * @param ideas - The array of all ideas.
 * @param ancestorIdeaId - The ID of the ancestor idea for which to find the descendent.
 * @returns The most recent descendent of the given ancestor idea.
 */
export const getMostRecentDescendent = (
	ideas: Idea[],
	ancestorIdeaId: number,
): Idea => {
	let mostRecentDescendent = ideas.find((idea) => idea.id === ancestorIdeaId);
	if (!mostRecentDescendent) {
		throw new Error(`Ancestor idea with id ${ancestorIdeaId} not found`);
	}
	const queue = [mostRecentDescendent];
	while (queue.length > 0) {
		const currentIdea = queue.shift();
		if (!currentIdea) break;
		const children = ideas.filter(
			(idea) => idea.parentIdeaId === currentIdea.id,
		);
		queue.push(...children);
		if (currentIdea.id > mostRecentDescendent.id) {
			mostRecentDescendent = currentIdea;
		}
	}
	return mostRecentDescendent;
};

/**
 * Retrieves all ancestors of a given idea in the ideas array.
 *
 * @param ideas - The array of all ideas.
 * @param lastIdeaId - The ID of the last idea in the chain of ancestors.
 * @returns An array of idea ids representing all the ancestors of the given idea.
 */
export const getAllAncestorIds = (
	ideas: Idea[],
	lastIdeaId: number,
): number[] => {
	// Finds all the ancestor IDs of a given idea
	const ancestorIds: number[] = [];
	let currentId: number | null = lastIdeaId;

	const findIdeaById = (id: number) => ideas.find((idea) => idea.id === id);

	while (currentId) {
		const current = findIdeaById(currentId);
		if (!current) {
			console.error(`Error finding idea list! IdeaId: ${currentId}`);
			break;
		}
		ancestorIds.unshift(current.id);
		currentId = current.parentIdeaId;
	}

	return ancestorIds;
};

/**
 * Retrieves all ideas since the most recent idea that has received comments.
 *
 * @param ideas
 * @param comments
 * @returns
 */
export const getIdeasSinceLastComment = (
	ideas: Idea[],
	comments: Record<number, Comment>,
): Idea[] => {
	// Extract idea IDs from comments and store them in a set for uniqueness
	const ideaIdsWithComments = new Set<number>();
	Object.values(comments).forEach((comment) => {
		ideaIdsWithComments.add(comment.ideaId);
	});
	// Find the ID of the most recently commented idea
	const newestCommentedIdeaId = Math.max(...Array.from(ideaIdsWithComments));
	// Return ideas that were created after the most recent comment
	return ideas.filter((idea) => idea.id > newestCommentedIdeaId);
};

export function prepareIdeasForExport(
	ideas: Idea[],
	selectedIdea: Idea,
): IdeaExport[] {
	const ideaExports: IdeaExport[] = [];
	const children = getChildren(ideas, selectedIdea.id);
	ideaExports.push({
		text: selectedIdea.text,
		incoming: false,
		outgoing: children.length > 1,
	});

	for (let i = 0; i < children.length; i++) {
		if (i > 0) {
			ideaExports.push({
				text: selectedIdea.text,
				incoming: true,
				outgoing: false,
			});
		}

		ideaExports.push(...prepareIdeasForExport(ideas, children[i]));
	}

	return ideaExports;
}

/**
 * Searches for the first mention of any active daemon's name in a given text.
 *
 * This function iterates over a list of active daemons and checks if their names are mentioned in the text.
 * It uses a regular expression to find the first occurrence of each daemon's name preceded by an '@' symbol.
 * The mentions are then sorted by their position in the text, and the name of the first mentioned daemon is returned.
 * If no mentions are found, the function returns null.
 *
 * @param text - The text in which to search for daemon mentions.
 * @param activeDaemons - An array of ChatDaemonConfig objects representing the active daemons.
 * @returns The name of the first mentioned daemon or null if no mentions are found.
 */
export function findDaemonMention(
	text: string,
	activeDaemons: ChatDaemonConfig[],
): string | null {
	const mentions = activeDaemons
		.map((daemon) => {
			const regex = new RegExp(`@${daemon.name}`, "i");
			const match = text.match(regex);
			return match && match.index !== undefined
				? { name: daemon.name, index: match.index }
				: null;
		})
		.filter(
			(mention): mention is { name: string; index: number } => mention !== null,
		)
		.sort((a, b) => a.index - b.index);

	return mentions.length > 0 && mentions[0] ? mentions[0].name : null;
}
