import { useState, useEffect, useCallback, useRef } from 'react';
import { selectCurrentBranchThoughts } from '../../../redux/ideaSlice';
import styled from 'styled-components';
import { useAppSelector } from '../../../hooks';
import { aiFont, fadeInAnimation } from '../../../styles/mixins';
import { ContainerHorizontal, Filler, Hint, TextButton } from '../../../styles/sharedStyles';
import BaseDaemon from '../../../daemons/baseDaemon';
import { Idea } from '../../../redux/models';


const TopLevelContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 16px 12px;
  box-sizing: border-box;
`

const BackgroundContainer = styled.div`
  background-color: var(--bg-color-secondary);
  width: 100%;
  height: auto;
  padding: 0px 12px 4px 12px;
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
  margin: 8px 0px;
  border: 0.5px solid var(--line-color-strong);
  border-radius: 4px;
  white-space: normal;
  word-break: break-word;
  ${aiFont};
  ${fadeInAnimation};
`;

const CompletionsContainer = () => {
  const [completions, setCompletions] = useState<string[]>([]);
  const currentBranchIdeas = useAppSelector(selectCurrentBranchThoughts);
  const branchLength = useRef(0);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [baseDaemon] = useState(new BaseDaemon(baseDaemonConfig));
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);

  const getNewCompletions = useCallback(async (branchIdeas: Idea[]) => {
    if (branchIdeas.length === 0 || !openAIKey) return;
    const completions = await baseDaemon.getCompletions(branchIdeas, openAIKey, openAIOrgId, baseModel);
    if (completions) setCompletions(completions);
  }, [baseDaemon, openAIKey, openAIOrgId, baseModel]);

  useEffect(() => {
    if (branchLength.current !== currentBranchIdeas.length) {
      getNewCompletions(currentBranchIdeas);
      branchLength.current = currentBranchIdeas.length;
    }
  }, [currentBranchIdeas, baseDaemon, openAIKey, openAIOrgId, baseModel, getNewCompletions]);

  return (
    <TopLevelContainer>
      <BackgroundContainer>
        <ContainerHorizontal style={{ alignItems: 'center' }}>
          <h4>Base model completions</h4>
          <Filler />
          <TextButton onClick={() => getNewCompletions(currentBranchIdeas)}>
            Refresh
          </TextButton>
        </ContainerHorizontal>
        {completions.length === 0 &&
          <Hint>Here you will see how the base model would continue your train of thought</Hint>
        }
        <StyledCompletionsContainer>
          {completions.map((completion, index) => (
            <StyledIndividualCompletion key={index + completion}>
              {completion}
            </StyledIndividualCompletion>
          ))}
        </StyledCompletionsContainer>
      </BackgroundContainer>
    </TopLevelContainer>
  )
}

export default CompletionsContainer;