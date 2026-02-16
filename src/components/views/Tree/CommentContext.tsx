import { useMemo } from "react";
import styled from "styled-components";
import { ChainOfThoughtType, type Comment } from "../../../redux/models";
import { Hint, ModalBox } from "../../../styles/sharedStyles";
import TextWithHighlights from "../../common/TextWithHighlights";

const InnerPanel = styled.div`
  background-color: var(--bg-color-secondary);
  padding: 12px;
  border-radius: 10px;
`;

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
		<ModalBox style={{ width: "70vw" }}>
			<h3 className="text-center">Comment context</h3>
			<hr />
			<Hint>
				A record of the AI's internal chain-of-thought process leading up to
				this comment.{" "}
				<b>You can modify the system and user prompts in the settings.</b>
			</Hint>
			<br />
			<InnerPanel>
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
					<Hint>Comment context is not available for old comments.</Hint>
				)}
			</InnerPanel>
		</ModalBox>
	);
};

export default CommentContext;
