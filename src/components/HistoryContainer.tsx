import styled from 'styled-components';
import IdeaContainer from './IdeaContainer';
import { useCallback, useState } from 'react';
import { useAppSelector } from '../hooks';

const StyledHistoryContainer = styled.div`
  padding: 10px 0px;
`;

const HistoryContainer = () => {
  const ideas = useAppSelector(state => state.text.ideas)
  const [commentOverflows, setCommentOverflows] = useState<{ [key: number]: number }>({}); // Maps ideaIds to the number of pixels that the comment panel overflows past the idea object itself

  const setCommentOverflow = useCallback((ideaId: number, height: number) => {
    setCommentOverflows(prevHeights => ({ ...prevHeights, [ideaId]: height}));
  }, [setCommentOverflows]);

  return (
    <StyledHistoryContainer>
      {/* TODO Add some cute animation when adding blocks */}
      {ideas.map((idea, index) => {
        const previousCommentOverflow = index === 0 ? 0 : commentOverflows[ideas[index - 1].id];
        return (<IdeaContainer key={index} idea={idea} offset={previousCommentOverflow} setCommentOverflow={setCommentOverflow} />)
      })}
    </StyledHistoryContainer>
  )
};

export default HistoryContainer;