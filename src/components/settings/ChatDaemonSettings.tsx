import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { dispatchError } from "../../errorHandler";
import { useAppDispatch } from "../../hooks";
import { removeChatDaemon, updateChatDaemon } from "../../redux/daemonSlice";
import type { ChatDaemonConfig } from "../../redux/models";
import { styledBackground } from "../../styles/mixins";
import {
	Button,
	ButtonDangerous,
	ButtonSmall,
	ContainerHorizontal,
	Filler,
	InfoButton,
	SettingLabel,
	TextArea,
	TextButton,
	TextInput,
} from "../../styles/sharedStyles";
import ButtonWithConfirmation from "../common/ButtonWithConfirmation";
import { useModal } from "../ModalContext";
import ChainOfThoughtInfo from "./ChainOfThoughtInfo";

const ChatDaemonSettingsContainer = styled.div`
  text-align: left;
`;

const StyledDiv = styled.div`
  padding: 8px;
  ${styledBackground};
`;

const useConfigChanged = (
	config: ChatDaemonConfig,
	currentState: Partial<ChatDaemonConfig>,
) => {
	return useMemo(() => {
		return Object.entries(currentState).some(
			([key, value]) => config[key as keyof ChatDaemonConfig] !== value,
		);
	}, [config, currentState]);
};

type ChatDaemonSettingsProps = {
	config: ChatDaemonConfig;
};

const ChatDaemonSettings: React.FC<ChatDaemonSettingsProps> = ({ config }) => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [isEnabled, setIsEnabled] = useState(config.enabled);
	const [name, setName] = useState(config.name) || "";
	const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt || "");
	const [userPrompts, setUserPrompts] = useState(config.userPrompts || []);
	const systemPromptRef = useRef<HTMLTextAreaElement>(null);
	const userPromptRefs = useRef<HTMLTextAreaElement[]>([]);
	const dispatch = useAppDispatch();
	const { addModal } = useModal();

	const configChanged = useConfigChanged(config, {
		name,
		systemPrompt,
		userPrompts,
		enabled: isEnabled,
	});

	const handleUserPromptChange = (
		index: number,
		value: string,
		textArea: HTMLTextAreaElement,
	) => {
		const newUserPrompts = [...userPrompts];
		newUserPrompts[index] = value;
		setUserPrompts(newUserPrompts);
		resizeTextArea(textArea);
	};

	const deleteUserPrompt = (index: number) => {
		if (userPrompts.length > 1) {
			const updatedPrompts = [
				...userPrompts.slice(0, index),
				...userPrompts.slice(index + 1),
			];
			setUserPrompts(updatedPrompts);
		}
	};

	const resizeTextArea = useCallback((textArea: HTMLTextAreaElement | null) => {
		if (textArea) {
			textArea.style.height = "auto";
			textArea.style.height = `${textArea.scrollHeight}px`;
		}
	}, []);

	useEffect(() => {
		if (!isCollapsed) {
			resizeTextArea(systemPromptRef.current);
			userPromptRefs.current.forEach((ref) => resizeTextArea(ref));
		}
	}, [isCollapsed, resizeTextArea]);

	useEffect(() => {
		if (!configChanged) return;
		try {
			const newConfig = {
				...config,
				name,
				systemPrompt,
				userPrompts,
				enabled: isEnabled,
			};
			dispatch(updateChatDaemon(newConfig));
		} catch (_error) {
			dispatchError("Couldn't update daemon config");
		}
	}, [
		configChanged,
		dispatch,
		config,
		name,
		systemPrompt,
		userPrompts,
		isEnabled,
	]);

	return (
		<ChatDaemonSettingsContainer>
			<span>
				<input
					type="checkbox"
					checked={isEnabled}
					onChange={(e) => setIsEnabled(e.target.checked)}
				/>
				<TextButton onClick={() => setIsCollapsed(!isCollapsed)}>
					<span>{isCollapsed ? "▼" : "▲"} </span>
					{config.name}
				</TextButton>
			</span>
			{!isCollapsed && (
				<StyledDiv>
					<label>
						<SettingLabel>Name</SettingLabel>
						<TextInput value={name} onChange={(e) => setName(e.target.value)} />
					</label>
					<br />
					<label>
						<SettingLabel>System prompt</SettingLabel>
						<TextArea
							ref={systemPromptRef}
							value={systemPrompt}
							onChange={(e) => {
								setSystemPrompt(e.target.value);
								resizeTextArea(e.target);
							}}
						/>
					</label>
					<br />
					<ContainerHorizontal
						style={{ alignItems: "center", justifyContent: "center" }}
					>
						<h4 style={{ marginRight: "8px" }}>Chain-of-thought prompts</h4>
						<InfoButton onClick={() => addModal(<ChainOfThoughtInfo />)} />
						<Filler />
					</ContainerHorizontal>
					{userPrompts.map((prompt, index) => (
						<div key={index}>
							<label>
								<SettingLabel>Prompt {index + 1}</SettingLabel>
							</label>
							<TextArea
								ref={(el) =>
									(userPromptRefs.current[index] = el as HTMLTextAreaElement)
								}
								value={prompt}
								onChange={(e) =>
									handleUserPromptChange(index, e.target.value, e.target)
								}
								style={{ width: "100%" }}
							/>
							<ButtonSmall
								onClick={() => deleteUserPrompt(index)}
								style={{ marginBottom: "10px" }}
							>
								Delete
							</ButtonSmall>
						</div>
					))}
					<Button onClick={() => setUserPrompts([...userPrompts, ""])}>
						Add User Prompt
					</Button>
					<ButtonWithConfirmation
						confirmationText="Are you sure you want to delete this daemon? This cannot be undone."
						onConfirm={() => dispatch(removeChatDaemon(config.id))}
					>
						<ButtonDangerous>Delete daemon</ButtonDangerous>
					</ButtonWithConfirmation>
				</StyledDiv>
			)}
		</ChatDaemonSettingsContainer>
	);
};

export default ChatDaemonSettings;
