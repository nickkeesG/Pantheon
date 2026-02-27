import type React from "react";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import type { Comment } from "../../../redux/models";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "../../ui/Dialog";
import CommentContext from "./CommentContext";

const CommentContainer: React.FC<{ comment: Comment }> = ({ comment }) => {
	const [isCopied, setIsCopied] = useState(false);

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
			<Dialog>
				<DialogTrigger asChild>
					<div className="group w-full relative px-3 py-1.5 text-[var(--text-color-secondary)] cursor-pointer rounded-lg font-ai text-[0.8em] transition-[background-color,border-color,color,opacity,transform] duration-200 hover:bg-[var(--highlight-weak)] active:not-has-[.copy-btn:active]:opacity-70">
						<div className="flex w-full items-center">
							<span className="text-[var(--accent-color-coral)]">
								{comment.daemonName}
							</span>
							<button
								type="button"
								onClick={copy}
								className="copy-btn cursor-pointer font-inherit bg-transparent text-[var(--text-color-secondary)] border-none rounded inline-flex items-center justify-center box-content [&>svg]:w-full [&>svg]:h-full w-3 h-3 p-1 ml-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100 active:not-disabled:opacity-70 hover:not-disabled:bg-[var(--highlight-weak)]"
							>
								{isCopied ? <FiCheckCircle /> : <FiCopy />}
							</button>
						</div>
						<div className="text-left line-clamp-8 animate-fade-in">
							{comment.text}
						</div>
					</div>
				</DialogTrigger>
				<DialogContent className="w-[70vw]">
					<DialogTitle className="sr-only">Comment context</DialogTitle>
					<DialogDescription className="sr-only">
						AI chain-of-thought for this comment
					</DialogDescription>
					<CommentContext comment={comment} />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CommentContainer;
