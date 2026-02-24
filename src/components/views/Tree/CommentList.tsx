import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import type { Comment } from "../../../redux/models";
import CommentContainer from "./CommentContainer";
import IncomingComment from "./IncomingComment";

const CommentListContainer = styled.div`
  flex: 0 0 27%;
`;

const StyledCommentList = styled.div`
  position: absolute;
  top: 0;
  width: 27%;
  z-index: 10;
`;

interface CommentListProps {
	offset: number;
	comments: Comment[];
	onHeightChanged: (newHeight: number) => void;
	onHoverChange: (isHovered: boolean) => void;
	daemonCommenting?: string;
}

const CommentList: React.FC<CommentListProps> = ({
	offset,
	comments,
	onHeightChanged,
	onHoverChange,
	daemonCommenting,
}) => {
	const listRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			onHeightChanged(entries[0].contentRect.height);
		});

		if (listRef.current) {
			resizeObserver.observe(listRef.current);
		}
		return () => {
			resizeObserver.disconnect();
		};
	}, [onHeightChanged]);

	return (
		<CommentListContainer
			onMouseEnter={() => onHoverChange(true)}
			onMouseLeave={() => onHoverChange(false)}
		>
			<StyledCommentList ref={listRef} style={{ top: `${offset}px` }}>
				{comments.length > 0 &&
					comments.map((comment) => (
						<CommentContainer key={comment.id} comment={comment} />
					))}
				{comments.length === 0 && daemonCommenting && (
					<IncomingComment daemonName={daemonCommenting} />
				)}
			</StyledCommentList>
		</CommentListContainer>
	);
};

export default CommentList;
