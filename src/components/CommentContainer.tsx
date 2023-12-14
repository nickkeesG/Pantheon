import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Comment } from '../redux/models';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledCommentContainer = styled.div`
  padding: 6px 12px;
  // position: absolute;
  color: var(--text-color-dark);
  animation: ${fadeIn} 0.3s ease-out forwards;
`;

const CommentName = styled.div`
  text-align: right;
  font-weight: bold;
`;

const CommentText = styled.div`
  text-align: left;
`;

const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <StyledCommentContainer>
      <CommentName>{comment.daemonName + "(" + comment.daemonType + ")"}</CommentName>
      <CommentText>{comment.text}</CommentText>
    </StyledCommentContainer>
  );
};

export default CommentContainer;