import React from 'react';
import styled from 'styled-components';
import { Comment } from '../../../redux/models';
import { IconButtonSmall, TextButton } from '../../../styles/sharedStyles';
import { IoIosThumbsUp } from "react-icons/io";
// import { useAppDispatch } from '../../../hooks';
// import { approveComment } from '../../../redux/commentSlice';
import { aiFont, fadeInAnimation } from '../../../styles/mixins';
import { useModal } from '../../ModalContext';
import CommentContext from './CommentContext';


const CommentName = styled.div`
  text-align: right;
  color: var(--accent-color-coral);
`;

const CommentText = styled.div`
  text-align: left;
`;


interface ThumbsUpIconProps {
  userApproved: boolean;
  [key: string]: any;
}

const ThumbsUpIcon = ({ userApproved, ...props }: ThumbsUpIconProps) => <IoIosThumbsUp {...props} />;

const ThumbsUpButton = styled(IconButtonSmall).attrs({ as: ThumbsUpIcon }) <{ userApproved: boolean }>`
  position: absolute;
  top: 2px;
  left: 8px;
  color: ${props => props.userApproved ? 'var(--accent-color-coral)' : 'var(--line-color)'};
  pointer-events: ${props => props.userApproved ? 'none' : 'auto'};
  cursor: ${props => props.userApproved ? 'default' : 'pointer'};
  opacity: ${props => props.userApproved ? '0.7' : '1'};
  transition: opacity 0.3s ease;
`;

const StyledCommentContainer = styled(TextButton)`
  width: 100%;
  position: relative;
  padding: 6px 12px;
  margin: 0px;
  color: var(--text-color-secondary);
  ${aiFont};
  ${fadeInAnimation};

  ${ThumbsUpButton} {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover ${ThumbsUpButton} {
    opacity: 1;
  }
`;


const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
  // const dispatch = useAppDispatch();
  const { addModal } = useModal();

  return (
    <div style={{ margin: '4px' }}>
      <StyledCommentContainer onClick={() => addModal(<CommentContext comment={comment} />)}>
        <CommentName>{comment.daemonName}</CommentName>
        <CommentText>{comment.text}</CommentText>
        {/* <ThumbsUpButton
          userApproved={comment.userApproved}
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            dispatch(approveComment(comment.id));
          }}
        /> */}
      </StyledCommentContainer>
    </div>
  );
};

export default CommentContainer;