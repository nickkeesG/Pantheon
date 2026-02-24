import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import BaseDaemon from "../../../daemons/baseDaemon";
import { useAppSelector } from "../../../hooks";
import { selectActiveThoughts } from "../../../redux/ideaSlice";
import type { Idea } from "../../../redux/models";
import { aiFont, fadeInAnimation } from "../../../styles/mixins";
import {
	ContainerHorizontal,
	Filler,
	Hint,
	TextButton,
} from "../../../styles/sharedStyles";

const TopLevelContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 16px 12px;
  box-sizing: border-box;
`;

const BackgroundContainer = styled.div`
  background-color: var(--bg-color-secondary);
  width: 100%;
  height: auto;
  padding: 0px 12px 12px 12px;
  box-sizing: border-box;
  border-radius: 4px;
`;

const StyledCompletionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  height: auto;
  min-height: 200px;
  box-sizing: border-box;
`;

const StyledIndividualCompletion = styled.div`
  position: relative;
  flex: 1;
  padding: 8px;
  border: 0.5px solid var(--line-color-strong);
  border-radius: 4px;
  white-space: normal;
  word-break: break-word;
  ${aiFont};
  ${fadeInAnimation};
`;

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
	}, [
		activeThoughts,
		baseDaemon,
		openAIKey,
		openAIOrgId,
		baseModel,
		getNewCompletions,
	]);

	return (
		<TopLevelContainer>
			<BackgroundContainer>
				<ContainerHorizontal style={{ alignItems: "center" }}>
					<h4>AI suggestions</h4>
					<Filler />
					<TextButton onClick={() => getNewCompletions(activeThoughts)}>
						Refresh
					</TextButton>
				</ContainerHorizontal>
				{completions.length === 0 && (
					<Hint>
						Here you will see the AI's thoughts of what might come next
					</Hint>
				)}
				<StyledCompletionsContainer>
					{completions.map((completion, index) => (
						<StyledIndividualCompletion key={index + completion}>
							{completion}
						</StyledIndividualCompletion>
					))}
				</StyledCompletionsContainer>
			</BackgroundContainer>
		</TopLevelContainer>
	);
};

export default CompletionsContainer;
