import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Idea, TextState, selectCommentsByIdeaId } from '../redux/contentSlice';
import CommentContainer from './CommentContainer';
import { useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
`;

const SidePanel = styled.div`
  flex: 1 1 20%;
  min-width: 20%;
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 60%;
  min-width: 60%;
`;

const CommentPanel = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 20%;
  z-index: 10;
`;

const StyledIdeaContainer = styled.div`
  padding: 10px;
  margin: 10px 0px;
  border: 0.1px solid var(--line-color-dark);
  border-radius: 4px;
`;

interface IdeaContainerProps {
  idea: Idea;
  offset: number;
  setCommentOverflow: (ideaId: number, height: number) => void;
}

const IdeaContainer: React.FC<IdeaContainerProps> = ({ idea, offset, setCommentOverflow }) => {
  const comments = useSelector((state: TextState) => selectCommentsByIdeaId(state, idea.id));
  const containerRef = useRef<HTMLDivElement>(null);
  const commentPanelRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleMouseEnter = () => {
    setIsHighlighted(true);
  };
  const handleMouseLeave = () => {
    setIsHighlighted(false)
  };

  useLayoutEffect(() => {
    const commentPanelResizeObserver = new ResizeObserver(entries => {
      const commentPanelHeight = entries[0].contentRect.height;
      const containerHeight = containerRef.current?.getBoundingClientRect().height || 0;
      const commentOverflow = (offset || 0) + commentPanelHeight - containerHeight;
      setCommentOverflow(idea.id, Math.max(0, commentOverflow));
    });

    if (commentPanelRef.current) { commentPanelResizeObserver.observe(commentPanelRef.current); }
    return () => { commentPanelResizeObserver.disconnect(); };
  }, [commentPanelRef, idea.id, offset]);

  const ideaContainerStyle = isHighlighted ? { borderColor: 'var(--line-color)', backgroundColor: 'var(--bg-color-light)' } : {};

  return (
    <Container ref={containerRef}>
      <SidePanel />
      <CenterPanel>
        <StyledIdeaContainer style={ideaContainerStyle}>
          {idea.text}
        </StyledIdeaContainer>
      </CenterPanel>
      <SidePanel />
      <CommentPanel
        ref={commentPanelRef}
        style={{ top: `${offset}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {comments.length > 0 && comments.map(comment => (
          <CommentContainer key={comment.id} comment={comment} />
        ))}
      </CommentPanel>
    </Container>
  );
};

export default IdeaContainer;