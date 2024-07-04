import React from 'react';
import styled from 'styled-components';
import { aiFont, fadeInAnimation } from '../../../styles/mixins';
import TypingAnimation from '../../../animations/typingAnimation/TypingAnimation';


const CommentName = styled.div`
  text-align: right;
  color: var(--accent-color-coral);
  opacity: 50%;
`;

const AnimationContainer = styled.div`
  text-align: left;
  opacity: 50%;
  height: 20px;
`;

const StyledCommentContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: relative;
  padding: 6px 12px;
  color: var(--text-color-secondary);
  ${aiFont};
  ${fadeInAnimation};
`;

const IncomingComment: React.FC<{ daemonName: string }> = ({ daemonName }) => {
  return (
    <StyledCommentContainer key='Incoming'>
      <CommentName>{daemonName}</CommentName>
      <AnimationContainer>
        <TypingAnimation />
      </AnimationContainer>
    </StyledCommentContainer>
  );
};

export default IncomingComment;