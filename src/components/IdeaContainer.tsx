import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Idea, selectCommentsForIdea, setCurrentIdea } from '../redux/textSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import CommentList from './CommentList';
import { IconButton } from '../styles/SharedStyles';
import leafIcon from '../assets/leaf.webp';

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  word-break: break-word;
`;

const SidePanel = styled.div`
  flex: 0 0 27%;
`;

const ActionPanel = styled.div`
  flex: 0 0 24px; // Fixed width
  display: flex;
  align-items: center;
  justify-content: center;
`

const CenterPanel = styled.div`
  flex: 0 0 46%;
  display: flex;
  flex-direction: row;
`;

const StyledIdeaContainer = styled.div`
  flex: 1;
  padding: 10px;
  margin: 10px 0px;
  border: 0.1px solid var(--line-color-dark);
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
`;

interface IdeaContainerProps {
  idea: Idea;
  baseCommentOffset: number;
  chatCommentOffset: number;
  setCommentOverflow: (isChatComment: boolean, ideaId: number, height: number) => void;
}

const IdeaContainer: React.FC<IdeaContainerProps> = ({ idea, baseCommentOffset, chatCommentOffset, setCommentOverflow }) => {
  const dispatch = useAppDispatch();
  const baseComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "base"));
  const chatComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "chat"));
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCommentPanelRef = useRef<HTMLDivElement>(null);
  const chatCommentPanelRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [showIconButtons, setShowIconButtons] = useState(false);

  const commentListHeightChanged = (isChat: boolean, newHeight: number, offset: number) => {
    // Get the height of the idea object
    const containerHeight = containerRef.current?.getBoundingClientRect().height || 0;
    // Calculate how far past the idea object the comments go
    const commentOverflow = (offset || 0) + newHeight - containerHeight;
    setCommentOverflow(isChat, idea.id, Math.max(0, commentOverflow));
  };

  const createNewBranch = () => {
    dispatch(setCurrentIdea(idea))
  }

  const ideaContainerStyle = isHighlighted ? { borderColor: 'var(--line-color)', backgroundColor: 'var(--bg-color-light)' } : {};

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setShowIconButtons(true)}
      onMouseLeave={() => setShowIconButtons(false)}
    >
      <SidePanel>
        <div
          ref={baseCommentPanelRef}
          onMouseEnter={() => setIsHighlighted(true)}
          onMouseLeave={() => setIsHighlighted(false)}>
          <CommentList
            offset={baseCommentOffset}
            comments={baseComments}
            onHeightChanged={(newHeight) => commentListHeightChanged(false, newHeight, baseCommentOffset)} />
        </div>
      </SidePanel>
      <CenterPanel>
        <ActionPanel style={{ visibility: showIconButtons ? 'visible' : 'hidden' }}>
        </ActionPanel>
        <StyledIdeaContainer style={ideaContainerStyle}>
          {idea.text}
        </StyledIdeaContainer>
        <ActionPanel style={{ visibility: showIconButtons ? 'visible' : 'hidden' }}>
          <IconButton onClick={createNewBranch}>
            <img src={leafIcon} alt="Leaf icon" />
          </IconButton>
        </ActionPanel>
      </CenterPanel>
      <SidePanel>
        <div
          ref={chatCommentPanelRef}
          onMouseEnter={() => setIsHighlighted(true)}
          onMouseLeave={() => setIsHighlighted(false)}>
          <CommentList
            offset={chatCommentOffset}
            comments={chatComments}
            onHeightChanged={(newHeight) => commentListHeightChanged(true, newHeight, chatCommentOffset)} />
        </div>
      </SidePanel>
    </Container>
  );
};

export default IdeaContainer;