import styled from "styled-components";
import CommentContainer from "./CommentContainer";
import { Comment } from "../../../redux/models";
import { useLayoutEffect, useRef } from 'react';

const StyledCommentList = styled.div`
  position: absolute;
  top: 0;
  width: 27%;
  z-index: 10;
`;

interface CommentListProps {
  offset: number;
  comments: Comment[];
  onHeightChanged: (newHeight: number) => any;
}

const CommentList: React.FC<CommentListProps> = ({ offset, comments, onHeightChanged }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      onHeightChanged(entries[0].contentRect.height);
    });

    if (listRef.current) { resizeObserver.observe(listRef.current); }
    return () => { resizeObserver.disconnect(); };
  }, [listRef, offset, comments, onHeightChanged]);

  return (
    <StyledCommentList
      ref={listRef}
      style={{ top: `${offset}px` }}
    >
      {comments.length > 0 && comments.map(comment => (
        <CommentContainer key={comment.id} comment={comment} />
      ))}
    </StyledCommentList>
  )
}

export default CommentList;