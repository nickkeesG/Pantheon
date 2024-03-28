import styled from 'styled-components';
import IdeaContainer from './IdeaContainer';
import { useCallback, useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { selectIdeasById } from '../../../redux/ideaSlice';
import StartingHints from './StartingHints';


const StyledHistoryContainer = styled.div`
  padding: 10px 0px;
  margin-top: 40px;
`;

const HistoryContainer = () => {
  const creatingSection = useAppSelector(state => state.ui.creatingSection);
  const activeIdeaIds = useAppSelector(state => state.ui.activeIdeaIds);
  const ideas = useAppSelector(state => selectIdeasById(state, activeIdeaIds))

  // Maps ideaIds to the number of pixels that the comment panel overflows past the idea object itself
  const [leftCommentOverflows, setLeftCommentOverflows] = useState<{ [key: number]: number }>({});
  const [rightCommentOverflows, setRightCommentOverflows] = useState<{ [key: number]: number }>({});

  const setCommentOverflow = useCallback((isRight: boolean, ideaId: number, height: number) => {
    const updater = (prevHeights: { [key: number]: number }) => {
      if (prevHeights[ideaId] === height) return prevHeights; // No change, return the original state to avoid re-render
      return { ...prevHeights, [ideaId]: height };
    };
  
    if (isRight) setRightCommentOverflows(updater);
    else setLeftCommentOverflows(updater);
  }, []);

  return (
    <StyledHistoryContainer>
      {ideas.length === 0 &&
        <StartingHints />
      }
      {!creatingSection && ideas.map((idea, index) => {
        const leftOverflow = index === 0 ? 0 : leftCommentOverflows[ideas[index - 1].id];
        const rightOverflow = index === 0 ? 0 : rightCommentOverflows[ideas[index - 1].id];
        return (
          <IdeaContainer
            key={idea.id}
            idea={idea}
            rightCommentOffset={rightOverflow}
            setCommentOverflow={setCommentOverflow}
            leftCommentOffset={leftOverflow} />
        )
      })}
    </StyledHistoryContainer>
  )
};

export default HistoryContainer;