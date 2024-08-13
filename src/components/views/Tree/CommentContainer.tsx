import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Comment } from '../../../redux/models';
import { ContainerHorizontal, IconButtonSmall, TextButton } from '../../../styles/sharedStyles';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';
import { aiFont, fadeInAnimation } from '../../../styles/mixins';
import { useModal } from '../../ModalContext';
import CommentContext from './CommentContext';


const CommentName = styled.div`
  color: var(--accent-color-coral);
`;

const CommentText = styled.div`
  text-align: left;
  ${fadeInAnimation};
`;

const CopyButton = styled(IconButtonSmall)`
  margin-left: auto;
`;

const StyledCommentContainer = styled(TextButton)`
  width: 100%;
  position: relative;
  padding: 6px 12px;
  margin: 0px;
  color: var(--text-color-secondary);
  ${aiFont};

  &:active:not(:disabled) {
    opacity: 1;
  }

  &:active:not(:disabled):not(:has(${CopyButton}:active)) {
    opacity: 70%;
  }

  ${CopyButton} {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover ${CopyButton} {
    opacity: 1;
  }

  ${CopyButton}:active:not(:disabled) {
    opacity: 70%;
  }
`;


const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { addModal } = useModal();

  const copy = useCallback(async (event: MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(comment.text);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy comment to clipboard", err)
    }
  }, [comment.text]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div style={{ margin: '4px' }}>
      <StyledCommentContainer onClick={() => addModal(<CommentContext comment={comment} />)}>
        <ContainerHorizontal style={{ alignItems: 'center' }}>
          <CommentName>{comment.daemonName}</CommentName>
          <CopyButton
            onClick={copy}>
            {isCopied ? <FiCheckCircle /> : <FiCopy />}
          </CopyButton>
        </ContainerHorizontal>
        <CommentText>{comment.text}</CommentText>
      </StyledCommentContainer>
    </div>
  );
};

export default CommentContainer;