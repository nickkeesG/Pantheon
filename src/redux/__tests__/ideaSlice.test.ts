import { selectSectionContentForExporting } from '../ideaSlice';

describe('selectSectionContentForExporting', () => {
  it('should return ideas for a given section ID', () => {
    const mockState = {
      idea: {
        ideas: {
          1: { id: 1, sectionId: 1, text: 'Idea 1', isUser: true, parentIdeaId: null, textTokens: [], tokenSurprisals: [] },
          2: { id: 2, sectionId: 1, text: 'Idea 2', isUser: true, parentIdeaId: 1, textTokens: [], tokenSurprisals: [] },
        },
      },
      section: {
        sections: {
          1: { id: 1, treeId: 1, ideaIds: [1, 2] },
        },
      },
    };

    const sectionId = 1;
    const selectedIdeas = selectSectionContentForExporting.resultFunc(mockState.idea.ideas, sectionId);

    expect(selectedIdeas).toHaveLength(2);
    expect(selectedIdeas[0].text).toEqual('Idea 1');
    expect(selectedIdeas[1].text).toEqual('Idea 2');
  });
});