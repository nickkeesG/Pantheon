import type React from "react";
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { FaArrowUp } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { findDaemonMention } from "../../../redux/storeUtils";
import { setLastTimeActive } from "../../../redux/uiSlice";
import TextWithHighlights from "../../common/TextWithHighlights";

interface InputBoxProps {
	dispatchIdea: () => void;
	dispatchInstruction: () => void;
	onChange: () => void;
}

export interface InputBoxHandle {
	getText: () => string;
	clearAndScrollToView: () => void;
}

const InputBox = forwardRef<InputBoxHandle, InputBoxProps>(
	({ dispatchIdea, dispatchInstruction, onChange }, ref) => {
		const textAreaRef = useRef<HTMLTextAreaElement>(null);
		const dispatch = useAppDispatch();
		const [mentionedDaemon, setMentionedDaemon] = useState<string | null>(null);
		const chatDaemons = useAppSelector((state) => state.daemon.chatDaemons);
		const enabledDaemons = useMemo(
			() => chatDaemons.filter((daemon) => daemon.enabled),
			[chatDaemons],
		);

		const resize = useCallback(() => {
			if (textAreaRef.current) {
				textAreaRef.current.style.height = "auto";
				textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
			}
		}, []);

		const clearAndScrollToView = useCallback(() => {
			if (textAreaRef.current) {
				textAreaRef.current.value = "";
				setMentionedDaemon(null);
				resize();
				textAreaRef.current.scrollIntoView();
			}
		}, [resize]);

		useImperativeHandle(ref, () => ({
			getText: () => {
				return textAreaRef.current ? textAreaRef.current.value : "";
			},
			clearAndScrollToView: clearAndScrollToView,
		}));

		const checkForMentions = () => {
			if (textAreaRef.current) {
				if (textAreaRef.current.value.trim() === "") {
					setMentionedDaemon(null);
				} else {
					setMentionedDaemon(
						findDaemonMention(textAreaRef.current.value, enabledDaemons),
					);
				}
			}
		};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			dispatch(setLastTimeActive());
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				if (textAreaRef.current && textAreaRef.current.value.trim() !== "") {
					if (event.ctrlKey) {
						dispatchInstruction();
					} else {
						dispatchIdea();
					}
				}
			}
		};

		return (
			<div className="relative w-[46%]">
				<textarea
					ref={textAreaRef}
					placeholder="What are you thinking about?"
					onChange={() => {
						resize();
						checkForMentions();
						onChange();
					}}
					onKeyDown={handleKeyDown}
					className="w-full min-w-full max-w-full box-border border-[0.5px] border-[var(--line-color)] rounded bg-[var(--bg-color-secondary)] text-[var(--text-color)] font-ai text-[0.8em] overflow-hidden block m-auto focus:outline-none focus:border-[var(--text-color)] font-inherit font-normal text-[inherit] resize-none mb-3 p-[10px_42px_20px_10px]"
				/>
				<button
					type="button"
					aria-label="Send thought"
					disabled={!textAreaRef?.current?.value.trim()}
					onClick={() => {
						dispatchIdea();
						textAreaRef.current?.focus();
					}}
					className="cursor-pointer font-inherit bg-transparent border-none rounded inline-flex items-center justify-center box-content [&>svg]:w-full [&>svg]:h-full w-5 h-5 absolute top-2 right-2 p-1.5 text-[var(--bg-color)] bg-[var(--text-color-secondary)]! [&>svg]:fill-current disabled:opacity-40 disabled:text-[var(--bg-color)] disabled:bg-[var(--text-color-secondary)]! disabled:cursor-default hover:not-disabled:opacity-70 hover:not-disabled:bg-[var(--text-color-secondary)]! transition-[background-color,border-color,color,opacity,transform] duration-200"
				>
					<FaArrowUp />
				</button>
				{mentionedDaemon && (
					<div className="absolute bottom-4 left-2.5 text-[0.85em] text-[var(--text-color-tertiary)] animate-fade-in">
						<TextWithHighlights
							text={`Pings ${mentionedDaemon}.`}
							highlights={[[6, 6 + mentionedDaemon.length]]}
						/>
					</div>
				)}
			</div>
		);
	},
);

export default InputBox;
