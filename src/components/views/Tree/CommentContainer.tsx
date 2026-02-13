import type React from "react";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import styled from "styled-components";
import type { Comment } from "../../../redux/models";
import {
	aiFont,
	fadeInAnimation,
	highlightOnHover,
} from "../../../styles/mixins";
import { IconButtonSmall } from "../../../styles/sharedStyles";
import { useModal } from "../../ModalContext";
import CommentContext from "./CommentContext";

const CommentText = styled.div`
  text-align: left;
  ${fadeInAnimation};
`;

const CopyButton = styled(IconButtonSmall)`
  margin-left: auto;
`;

const StyledCommentContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 6px 12px;
  margin: 0px;
  color: var(--text-color-secondary);
  cursor: pointer;
  border-radius: 8px;
  ${highlightOnHover};
  ${aiFont};

  &:active:not(:has(${CopyButton}:active)) {
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

	const copy = useCallback(
		async (event: MouseEvent) => {
			event.stopPropagation();
			try {
				await navigator.clipboard.writeText(comment.text);
				setIsCopied(true);
			} catch (err) {
				console.error("Failed to copy comment to clipboard", err);
			}
		},
		[comment.text],
	);

	useEffect(() => {
		if (isCopied) {
			const timer = setTimeout(() => {
				setIsCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isCopied]);

	return (
		<div className="m-1">
			<StyledCommentContainer
				onClick={() => addModal(<CommentContext comment={comment} />)}
			>
				<div className="flex w-full items-center">
					<span className="text-[var(--accent-color-coral)]">
						{comment.daemonName}
					</span>
					<CopyButton onClick={copy}>
						{isCopied ? <FiCheckCircle /> : <FiCopy />}
					</CopyButton>
				</div>
				<CommentText>{comment.text}</CommentText>
			</StyledCommentContainer>
		</div>
	);
};

export default CommentContainer;
