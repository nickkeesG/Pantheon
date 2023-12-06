import React from 'react';
import styled from 'styled-components';
import { Comment } from '../redux/contentSlice';

const StyledCommentContainer = styled.div`
  padding: 12px;
  position: absolute;
  color: var(--text-color-dark)
`;

const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <StyledCommentContainer>
      {comment.text}
    </StyledCommentContainer>
  );
};

export default CommentContainer;