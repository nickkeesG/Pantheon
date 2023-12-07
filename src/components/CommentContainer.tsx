import React from 'react';
import styled from 'styled-components';
import { Comment } from '../redux/contentSlice';

const StyledCommentContainer = styled.div`
  padding: 6px 12px;
  // position: absolute;
  color: var(--text-color-dark);
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
      <CommentName>{comment.daemonName}</CommentName>
      <CommentText>{comment.text}</CommentText>
    </StyledCommentContainer>
  );
};

export default CommentContainer;