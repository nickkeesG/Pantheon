import { useLayoutEffect, useRef } from "react";
import type { Comment } from "../../../redux/models";
import CommentContainer from "./CommentContainer";
import IncomingComment from "./IncomingComment";

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
		// biome-ignore lint/a11y/noStaticElementInteractions: hover highlight only, not interactive
		<div
			className="flex-[0_0_27%]"
			onMouseEnter={() => onHoverChange(true)}
			onMouseLeave={() => onHoverChange(false)}
		>
			<div
				ref={listRef}
				className="absolute top-0 w-[27%] z-10"
				style={{ top: `${offset}px` }}
			>
				{comments.length > 0 &&
					comments.map((comment) => (
						<CommentContainer key={comment.id} comment={comment} />
					))}
				{comments.length === 0 && daemonCommenting && (
					<IncomingComment daemonName={daemonCommenting} />
				)}
			</div>
		</div>
	);
};

export default CommentList;
