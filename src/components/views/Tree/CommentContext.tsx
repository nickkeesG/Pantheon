import { useMemo } from "react";
import { ChainOfThoughtType, type Comment } from "../../../redux/models";
import TextWithHighlights from "../../common/TextWithHighlights";

interface CommentContextProps {
	comment: Comment;
}

const CommentContext: React.FC<CommentContextProps> = ({ comment }) => {
	const chainOfThoughtExists = useMemo(
		() =>
			comment.chainOfThought !== undefined &&
			comment.chainOfThought?.length > 0,
		[comment.chainOfThought],
	);
	const modifiedChainOfThought = useMemo(
		() =>
			comment.chainOfThought?.map(([author, text]) => [
				author === ChainOfThoughtType.Daemon
					? comment.daemonName
					: `${author.charAt(0).toUpperCase()}${author.slice(1)} prompt`,
				text,
			]),
		[comment.chainOfThought, comment.daemonName],
	);

	return (
		<>
			<h3 className="text-center">Comment context</h3>
			<hr />
			<div className="text-[0.85em] text-[var(--text-color-tertiary)]">
				A record of the AI's internal chain-of-thought process leading up to
				this comment.{" "}
				<b>You can modify the system and user prompts in the settings.</b>
			</div>
			<br />
			<div className="bg-[var(--bg-color-secondary)] p-3 rounded-[10px]">
				{chainOfThoughtExists &&
					modifiedChainOfThought?.map(([author, text], index) => (
						<div key={`${author}-${text}`}>
							{index === 0 && <b>{author}</b>}
							{index !== 0 && (
								<b>
									{index}. {author}
								</b>
							)}
							<div
								style={{
									padding: "20px 8px 20px 20px",
									fontFamily:
										author === comment.daemonName
											? "Monaspace Neon"
											: "inherit",
									fontSize: author === comment.daemonName ? "0.8em" : "0.9em",
								}}
							>
								<TextWithHighlights text={text} highlights={[]} />
							</div>
						</div>
					))}
				{!chainOfThoughtExists && (
					<div className="text-[0.85em] text-[var(--text-color-tertiary)]">
						Comment context is not available for old comments.
					</div>
				)}
			</div>
		</>
	);
};

export default CommentContext;
