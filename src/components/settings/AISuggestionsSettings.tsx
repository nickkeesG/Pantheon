import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BaseDaemon from "../../daemons/baseDaemon";
import { dispatchError } from "../../errorHandler";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { updateBaseDaemon } from "../../redux/daemonSlice";
import { selectActiveThoughts } from "../../redux/ideaSlice";
import type { BaseDaemonConfig } from "../../redux/models";
import { Button, ContainerHorizontal, Hint } from "../../styles/sharedStyles";
import InfoModal from "../common/InfoModal";
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

const AISuggestionsSettings = () => {
	const config = useAppSelector((state) => state.daemon.baseDaemon);
	const baseModel = useAppSelector((state) => state.config.openAI.baseModel);
	const activeThoughts = useAppSelector(selectActiveThoughts);
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

	const showExample = useCallback(() => {
		const daemon = new BaseDaemon(config);
		const prompt = daemon.getContext(activeThoughts);
		addModal(
			<InfoModal>
				<br />
				<Hint>
					Final prompt given to the base model. This is what the AI will see,
					given these templates, in the selected tree.
				</Hint>
				<div className="bg-[var(--bg-color-secondary)] p-3 rounded-lg mt-2.5 whitespace-pre-wrap break-words font-ai text-[0.8em]">
					{prompt}
				</div>
			</InfoModal>,
		);
	}, [config, activeThoughts, addModal]);

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
				<div>
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
				<div>
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
				<Button onClick={showExample}>Show example prompt</Button>
				<div>
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
			</div>
		</div>
	);
};

export default AISuggestionsSettings;
