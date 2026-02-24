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
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { findDaemonMention } from "../../../redux/storeUtils";
import { setLastTimeActive } from "../../../redux/uiSlice";
import { fadeInAnimation } from "../../../styles/mixins";
import { Hint, IconButtonLarge, TextArea } from "../../../styles/sharedStyles";
import TextWithHighlights from "../../common/TextWithHighlights";

const TextAreaField = styled(TextArea)`
  width: 100%;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  overflow: hidden;
  resize: none;
  margin: 0px 0px 12px 0px;
  padding: 10px 42px 20px 10px;
`;

const SendButton = styled(IconButtonLarge).attrs({
	"aria-label": "Send thought",
})`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px;
  color: var(--bg-color);
  background-color: var(--text-color-secondary);
  svg {
    fill: currentColor;
  }

  &:disabled {
    opacity: 40%;
    color: var(--bg-color);
    background-color: var(--text-color-secondary);
  }

  &:hover:not(:disabled) {
    opacity: 70%;
    background-color: var(--text-color-secondary);
  }
`;

const MentionHint = styled(Hint)`
  position: absolute;
  bottom: 16px;
  left: 10px;
  ${fadeInAnimation};
`;

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
		}, [textAreaRef]);

		const clearAndScrollToView = useCallback(() => {
			if (textAreaRef.current) {
				textAreaRef.current.value = "";
				setMentionedDaemon(null);
				resize();
				textAreaRef.current.scrollIntoView();
			}
		}, [textAreaRef, resize]);

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
			<div style={{ position: "relative", width: "46%" }}>
				<TextAreaField
					ref={textAreaRef}
					placeholder="What are you thinking about?"
					onChange={() => {
						resize();
						checkForMentions();
						onChange();
					}}
					onKeyDown={handleKeyDown}
				/>
				<SendButton
					disabled={!textAreaRef?.current?.value.trim()}
					onClick={() => {
						dispatchIdea();
						textAreaRef.current?.focus();
					}}
				>
					<FaArrowUp />
				</SendButton>
				{mentionedDaemon && (
					<MentionHint>
						<TextWithHighlights
							text={`Pings ${mentionedDaemon}.`}
							highlights={[[6, 6 + mentionedDaemon.length]]}
						/>
					</MentionHint>
				)}
			</div>
		);
	},
);

export default InputBox;
