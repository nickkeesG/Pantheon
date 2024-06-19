import React from 'react';
import styled from 'styled-components';
import { Comment } from '../../../redux/models';
import { Hint, IconButtonSmall } from '../../../styles/sharedStyles';
import { IoIosThumbsUp } from "react-icons/io";
import { useAppDispatch } from '../../../hooks';
import { approveComment } from '../../../redux/commentSlice';
import { aiFont, fadeInAnimation } from '../../../styles/mixins';
import { useModal } from '../../ModalContext';
import TextWithHighlights from '../../common/TextWithHighlights';


const CommentName = styled.div`
  text-align: right;
  color: var(--accent-color-coral);
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
  color: ${props => props.userApproved ? 'var(--accent-color-coral)' : 'var(--line-color)'};
  pointer-events: ${props => props.userApproved ? 'none' : 'auto'};
  cursor: ${props => props.userApproved ? 'default' : 'pointer'};
  opacity: ${props => props.userApproved ? '0.7' : '1'};
  transition: opacity 0.3s ease;
`;

const StyledCommentContainer = styled.div`
  position: relative;
  padding: 6px 12px;
  color: var(--text-color-dark);
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

const HistoryPanel = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px 44px 20px 20px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
  width: 50vw;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
`;


const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
  const dispatch = useAppDispatch();
  const { addModal } = useModal();

  const openCommentHistory = () => {
    addModal(<HistoryPanel>
      <h2>Comment History</h2>
      {comment.history?.map(([author, text], index) => (
        <div key={index}>
          <h3>{author.toUpperCase()}</h3>
          <br />
          <TextWithHighlights text={text} highlights={[]} />
          <br />
          <br />
        </div>
      ))}
      {(comment.history === undefined || comment.history?.length === 0) && <Hint>Comment history is not available for old comments.</Hint>}
    </HistoryPanel>);
  }

  return (
    <div>
      <StyledCommentContainer onClick={openCommentHistory}>
        <CommentName>{comment.daemonName}</CommentName>
        <CommentText>{comment.text}</CommentText>
        <ThumbsUpButton
          userApproved={comment.userApproved}
          onClick={() => dispatch(approveComment(comment.id))}
        />
      </StyledCommentContainer>
    </div>
  );
};

export default CommentContainer;