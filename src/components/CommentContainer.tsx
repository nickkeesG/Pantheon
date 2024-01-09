import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Comment } from '../redux/models';
import { IconButtonSmall } from '../styles/sharedStyles';
import { IoIosThumbsUp } from "react-icons/io";
import { useAppDispatch } from '../hooks';
import { approveComment } from '../redux/textSlice';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CommentName = styled.div`
  text-align: right;
  font-weight: bold;
`;

const CommentText = styled.div`
  text-align: left;
`;

interface ThumbsUpIconProps {
  userApproved: boolean;
  [key: string]: any; // for the rest of the props
}

const ThumbsUpIcon = ({ userApproved, ...props }: ThumbsUpIconProps) => <IoIosThumbsUp {...props} />;

const ThumbsUpButton = styled(IconButtonSmall).attrs({ as: ThumbsUpIcon }) <{ userApproved: boolean }>`
  position: absolute;
  bottom: 6px;
  right: 12px;
  color: ${props => props.userApproved ? 'var(--accent-color)' : 'var(--line-color)'};
  pointer-events: ${props => props.userApproved ? 'none' : 'auto'};
  cursor: ${props => props.userApproved ? 'default' : 'pointer'};
  opacity: ${props => props.userApproved ? '0.7' : '1'};
  transition: opacity 0.3s ease;
`;

const StyledCommentContainer = styled.div`
position: relative;
  padding: 6px 12px;
  color: var(--text-color-dark);
  animation: ${fadeIn} 0.3s ease-out forwards;

  // Initially set the ThumbsUpButton to be fully transparent
  ${ThumbsUpButton} {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  // Change the opacity to make the ThumbsUpButton visible when hovering over the container
  &:hover ${ThumbsUpButton} {
    opacity: 1;
  }
`;

const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
  const dispatch = useAppDispatch();

  return (
    <StyledCommentContainer>
      <CommentName>{comment.daemonName + "(" + comment.daemonType + ")"}</CommentName>
      <CommentText>{comment.text}</CommentText>
      <ThumbsUpButton
        userApproved={comment.userApproved}
        onClick={() => dispatch(approveComment({ commentId: comment.id }))}
      />
    </StyledCommentContainer>
  );
};

export default CommentContainer;