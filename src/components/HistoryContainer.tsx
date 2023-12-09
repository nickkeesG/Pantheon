import styled from 'styled-components';
import IdeaContainer from './IdeaContainer';
import { useCallback, useState } from 'react';
import { useAppSelector } from '../hooks';

const StyledHistoryContainer = styled.div`
  padding: 10px 0px;
`;

const HistoryContainer = () => {
  const ideas = useAppSelector(state => state.text.ideas)
  // Maps ideaIds to the number of pixels that the comment panel overflows past the idea object itself
  const [baseCommentOverflows, setBaseCommentOverflows] = useState<{ [key: number]: number }>({});
  const [chatCommentOverflows, setChatCommentOverflows] = useState<{ [key: number]: number }>({});

  const setCommentOverflow = useCallback((isChat: boolean, ideaId: number, height: number) => {
    if (isChat) setChatCommentOverflows(prevHeights => ({ ...prevHeights, [ideaId]: height }));
    else setBaseCommentOverflows(prevHeights => ({ ...prevHeights, [ideaId]: height }));
  }, [setBaseCommentOverflows, setChatCommentOverflows, chatCommentOverflows, baseCommentOverflows]);

  return (
    <StyledHistoryContainer>
      {/* TODO Add some cute animation when adding blocks */}
      {ideas.map((idea, index) => {
        const baseOverflow = index === 0 ? 0 : baseCommentOverflows[ideas[index - 1].id];
        const chatOverflow = index === 0 ? 0 : chatCommentOverflows[ideas[index - 1].id];
        return (
          <IdeaContainer
            key={idea.id}
            idea={idea}
            chatCommentOffset={chatOverflow}
            setCommentOverflow={setCommentOverflow}
            baseCommentOffset={baseOverflow} />
        )
      })}
    </StyledHistoryContainer>
  )
};

export default HistoryContainer;