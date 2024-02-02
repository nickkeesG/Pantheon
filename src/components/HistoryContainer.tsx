import styled from 'styled-components';
import IdeaContainer from './IdeaContainer';
import { useCallback, useState } from 'react';
import { useAppSelector } from '../hooks';
import { selectIdeasById } from '../redux/ideaSlice';


const StyledHistoryContainer = styled.div`
  padding: 10px 0px;
  margin-top: 40px;
`;

const HistoryContainer = () => {
  const creatingSection = useAppSelector(state => state.ui.creatingSection);
  const activeIdeaIds = useAppSelector(state => state.ui.activeIdeaIds);
  const ideas = useAppSelector(state => selectIdeasById(state, activeIdeaIds))

  // Maps ideaIds to the number of pixels that the comment panel overflows past the idea object itself
  const [baseCommentOverflows, setBaseCommentOverflows] = useState<{ [key: number]: number }>({});
  const [chatCommentOverflows, setChatCommentOverflows] = useState<{ [key: number]: number }>({});

  const setCommentOverflow = useCallback((isChat: boolean, ideaId: number, height: number) => {
    const updater = (prevHeights: { [key: number]: number }) => {
      if (prevHeights[ideaId] === height) return prevHeights; // No change, return the original state to avoid re-render
      return { ...prevHeights, [ideaId]: height };
    };
  
    if (isChat) setChatCommentOverflows(updater);
    else setBaseCommentOverflows(updater);
  }, []);

  return (
    <StyledHistoryContainer>
      {/* TODO Add some cute animation when adding blocks */}
      {!creatingSection && ideas.map((idea, index) => {
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