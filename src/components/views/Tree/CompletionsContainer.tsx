import { useCallback, useEffect, useRef, useState } from "react";
import BaseDaemon from "../../../daemons/baseDaemon";
import { useAppSelector } from "../../../hooks";
import { selectActiveThoughts } from "../../../redux/ideaSlice";
import type { Idea } from "../../../redux/models";

const CompletionsContainer = () => {
	const [completions, setCompletions] = useState<string[]>([]);
	const activeThoughts = useAppSelector(selectActiveThoughts);
	const branchLength = useRef(0);
	const baseDaemonConfig = useAppSelector((state) => state.daemon.baseDaemon);
	const [baseDaemon, setBaseDaemon] = useState(
		new BaseDaemon(baseDaemonConfig),
	);
	const openAIKey = useAppSelector((state) => state.config.openAI.ApiKey);
	const openAIOrgId = useAppSelector((state) => state.config.openAI.OrgId);
	const baseModel = useAppSelector((state) => state.config.openAI.baseModel);

	useEffect(() => {
		setBaseDaemon(new BaseDaemon(baseDaemonConfig));
	}, [baseDaemonConfig]);

	const getNewCompletions = useCallback(
		async (branchIdeas: Idea[]) => {
			if (branchIdeas.length === 0 || !openAIKey) return;
			const completions = await baseDaemon.getCompletions(
				branchIdeas,
				openAIKey,
				openAIOrgId,
				baseModel,
			);
			if (completions) setCompletions(completions);
		},
		[baseDaemon, openAIKey, openAIOrgId, baseModel],
	);

	useEffect(() => {
		if (branchLength.current !== activeThoughts.length) {
			getNewCompletions(activeThoughts);
			branchLength.current = activeThoughts.length;
		}
	}, [activeThoughts, getNewCompletions]);

	return (
		<div className="w-full h-auto p-[16px_12px] box-border">
			<div className="bg-[var(--bg-color-secondary)] w-full h-auto p-[0px_12px_12px_12px] box-border rounded">
				<div className="flex flex-row w-full box-border items-center">
					<h4>AI suggestions</h4>
					<div className="flex-1" />
					<button
						type="button"
						onClick={() => getNewCompletions(activeThoughts)}
						className="cursor-pointer font-inherit text-[inherit] bg-transparent text-[var(--text-color-secondary)] border-none rounded-lg px-2 py-1 m-1 transition-[background-color,border-color,color,opacity,transform] duration-200 hover:not-disabled:bg-[var(--highlight-weak)] active:not-disabled:opacity-70"
					>
						Refresh
					</button>
				</div>
				{completions.length === 0 && (
					<div className="text-[0.85em] text-[var(--text-color-tertiary)]">
						Here you will see the AI's thoughts of what might come next
					</div>
				)}
				<div className="grid grid-cols-3 gap-2.5 w-full h-auto min-h-[200px] box-border">
					{completions.map((completion, index) => (
						<div
							key={index + completion}
							className="relative flex-1 p-2 border-[0.5px] border-[var(--line-color-strong)] rounded whitespace-normal break-words font-ai text-[0.8em] animate-fade-in"
						>
							{completion}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CompletionsContainer;
