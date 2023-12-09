import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Idea, selectCommentsForIdea } from '../redux/textSlice';
import { useAppSelector } from '../hooks';
import CommentList from './CommentList';

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  word-break: break-word;
`;

const SidePanel = styled.div`
  flex: 1 1 30%;
  min-width: 30%;
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 40%;
  min-width: 40%;
`;

const StyledIdeaContainer = styled.div`
  padding: 10px;
  margin: 10px 0px;
  border: 0.1px solid var(--line-color-dark);
  border-radius: 4px;
`;

interface IdeaContainerProps {
  idea: Idea;
  baseCommentOffset: number;
  chatCommentOffset: number;
  setCommentOverflow: (isChatComment: boolean, ideaId: number, height: number) => void;
}

const IdeaContainer: React.FC<IdeaContainerProps> = ({ idea, baseCommentOffset, chatCommentOffset, setCommentOverflow }) => {
  const baseComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "base"));
  const chatComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "chat"));
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCommentPanelRef = useRef<HTMLDivElement>(null);
  const chatCommentPanelRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const commentListHeightChanged = (isChat: boolean, newHeight: number, offset: number) => {
    // Get the height of the idea object
    const containerHeight = containerRef.current?.getBoundingClientRect().height || 0;
    // Calculate how far past the idea object the comments go
    const commentOverflow = (offset || 0) + newHeight - containerHeight;
    setCommentOverflow(isChat, idea.id, Math.max(0, commentOverflow));
  };

  const ideaContainerStyle = isHighlighted ? { borderColor: 'var(--line-color)', backgroundColor: 'var(--bg-color-light)' } : {};

  return (
    <Container ref={containerRef}>
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
        <StyledIdeaContainer style={ideaContainerStyle}>
          {idea.text}
        </StyledIdeaContainer>
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