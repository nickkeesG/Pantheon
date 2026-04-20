import type { Idea } from "../redux/models";

export function getHighlightsArray(idea: Idea): [number, number][] {
	if (!idea.mention) return [];
	const searchString = `@${idea.mention.toLowerCase()}`;
	const textLower = idea.text.toLowerCase();
	const startIndex = textLower.indexOf(searchString);
	const endIndex = startIndex + searchString.length;
	return startIndex >= 0 ? [[startIndex, endIndex]] : [];
}
