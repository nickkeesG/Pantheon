import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BaseDaemon from "../../daemons/baseDaemon";
import { defaultDaemonState } from "../../daemons/daemonInstructions";
import { dispatchError } from "../../errorHandler";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateBaseDaemon } from "../../redux/daemonSlice";
import type { BaseDaemonConfig, Idea } from "../../redux/models";
import { Button, ContainerHorizontal, Hint } from "../../styles/sharedStyles";
import InfoModal from "../common/InfoModal";
import ResetButton from "../common/ResetButton";
import { useModal } from "../ModalContext";

const useConfigChanged = (
	config: BaseDaemonConfig,
	currentState: Partial<BaseDaemonConfig>,
) => {
	return useMemo(() => {
		return Object.entries(currentState).some(
			([key, value]) => config[key as keyof BaseDaemonConfig] !== value,
		);
	}, [config, currentState]);
};

const defaults = defaultDaemonState.baseDaemon;

const AISuggestionsSettings = () => {
	const config = useAppSelector((state) => state.daemon.baseDaemon);
	const baseModel = useAppSelector((state) => state.config.openAI.baseModel);
	const [mainTemplate, setMainTemplate] = useState(config.mainTemplate || "");
	const [ideaTemplate, setIdeaTemplate] = useState(config.ideaTemplate || "");
	const [temperature, setTemperature] = useState(
		config.temperature !== undefined ? config.temperature : 0.7,
	);
	const mainTemplateRef = useRef<HTMLTextAreaElement>(null);
	const ideaTemplateRef = useRef<HTMLTextAreaElement>(null);
	const { addModal } = useModal();
	const dispatch = useAppDispatch();

	const configChanged = useConfigChanged(config, {
		mainTemplate,
		ideaTemplate,
		temperature,
	});

	const resizeTextArea = useCallback((textArea: HTMLTextAreaElement | null) => {
		if (textArea) {
			textArea.style.height = "auto";
			textArea.style.height = `${textArea.scrollHeight}px`;
		}
	}, []);

	useEffect(() => {
		resizeTextArea(mainTemplateRef.current);
		resizeTextArea(ideaTemplateRef.current);
	}, [resizeTextArea]);

	const exampleIdeas: Idea[] = [
		{
			id: 1,
			type: 0,
			sectionId: 1,
			parentIdeaId: null,
			text: "The city was quiet, but not in the way that felt peaceful.",
		},
		{
			id: 2,
			type: 0,
			sectionId: 1,
			parentIdeaId: 1,
			text: "She noticed the streetlights flickering in a pattern she hadn't seen before.",
		},
		{
			id: 3,
			type: 0,
			sectionId: 1,
			parentIdeaId: 2,
			text: "It reminded her of something from childhood, though she couldn't place it.",
		},
	];

	const showExample = useCallback(() => {
		const daemon = new BaseDaemon(config);
		const prompt = daemon.getContext(exampleIdeas);
		addModal(
			<InfoModal>
				<br />
				<Hint>What the base model will see with current templates</Hint>
				<div className="bg-[var(--bg-color-secondary)] p-3 rounded-lg mt-2.5 whitespace-pre-wrap break-words font-ai text-[0.8em]">
					{prompt}
				</div>
			</InfoModal>,
		);
	}, [config, addModal]);

	useEffect(() => {
		if (!configChanged) return;
		try {
			const newConfig = {
				...config,
				mainTemplate,
				ideaTemplate,
				temperature,
			};
			dispatch(updateBaseDaemon(newConfig));
		} catch (error) {
			dispatchError(`Failed to update config: ${error}`);
		}
	}, [
		dispatch,
		config,
		configChanged,
		mainTemplate,
		ideaTemplate,
		temperature,
	]);

	return (
		<div>
			<h4>AI suggestions</h4>
			<Hint style={{ paddingBottom: "8px" }}>
				AI suggestions are the AI's ideas for what might come next. They are
				powered by the given <i>base model</i> (currently <b>{baseModel}</b>).
			</Hint>
			<div className="space-y-4">
				<div className="flex items-start gap-3">
					<div className="flex-1">
						<label
							htmlFor="main-template"
							className="text-sm mb-[5px] text-[var(--text-color-secondary)]"
						>
							Main template
						</label>
						<textarea
							id="main-template"
							ref={mainTemplateRef}
							value={mainTemplate}
							onChange={(e) => {
								setMainTemplate(e.target.value);
								resizeTextArea(e.target);
							}}
							className="w-full min-w-full max-w-full p-2.5 box-border border-[0.5px] border-[var(--line-color)] rounded bg-[var(--bg-color-secondary)] text-[var(--text-color)] font-ai text-[0.8em] overflow-hidden block m-auto focus:outline-none focus:border-[var(--text-color)]"
						/>
					</div>
					<div className="w-6 flex justify-center pt-5">
						{mainTemplate !== defaults.mainTemplate && (
							<ResetButton
								onClick={() => setMainTemplate(defaults.mainTemplate)}
							/>
						)}
					</div>
				</div>
				<div className="flex items-start gap-3">
					<div className="flex-1">
						<label
							htmlFor="idea-template"
							className="text-sm mb-[5px] text-[var(--text-color-secondary)]"
						>
							Idea template
						</label>
						<textarea
							id="idea-template"
							ref={ideaTemplateRef}
							value={ideaTemplate}
							onChange={(e) => {
								setIdeaTemplate(e.target.value);
								resizeTextArea(e.target);
							}}
							className="w-full min-w-full max-w-full p-2.5 box-border border-[0.5px] border-[var(--line-color)] rounded bg-[var(--bg-color-secondary)] text-[var(--text-color)] font-ai text-[0.8em] overflow-hidden block m-auto focus:outline-none focus:border-[var(--text-color)]"
						/>
					</div>
					<div className="w-6 flex justify-center pt-5">
						{ideaTemplate !== defaults.ideaTemplate && (
							<ResetButton
								onClick={() => setIdeaTemplate(defaults.ideaTemplate)}
							/>
						)}
					</div>
				</div>
				<Button onClick={showExample}>Show example prompt</Button>
				<div className="flex gap-3">
					<div className="flex-1">
						<label
							htmlFor="temperature"
							className="text-sm mb-[5px] text-[var(--text-color-secondary)]"
						>
							Temperature
						</label>
						<ContainerHorizontal>
							<input
								id="temperature"
								type="range"
								min="0"
								max="2"
								step="0.05"
								value={temperature}
								onChange={(e) => setTemperature(parseFloat(e.target.value))}
								style={{ width: "100%" }}
							/>
							<div style={{ padding: "4px 8px 4px 16px" }}>
								{temperature.toFixed(2)}
							</div>
						</ContainerHorizontal>
					</div>
					<div className="w-6 flex justify-center items-center">
						{temperature !== defaults.temperature && (
							<ResetButton
								onClick={() => setTemperature(defaults.temperature)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AISuggestionsSettings;
