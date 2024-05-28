import { useState, useEffect, useCallback } from 'react';
import { selectCurrentBranchIdeas } from '../../../redux/ideaSlice';
import styled from 'styled-components';
import { useAppSelector } from '../../../hooks';
import { dispatchError } from '../../../errorHandler';
import { fadeInAnimation } from '../../../styles/mixins';
import { ContainerHorizontal, Filler, Hint, TextButton } from '../../../styles/sharedStyles';
import BaseDaemon from '../../../daemons/baseDaemon';


const TopLevelContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 16px 12px;
  box-sizing: border-box;
`

const BackgroundContainer = styled.div`
  background-color: var(--bg-color-light);
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
  border: 0.5px solid var(--line-color-dark);
  border-radius: 4px;
  ${fadeInAnimation};
`;

const CompletionsContainer = () => {
  const [completions, setCompletions] = useState<string[]>([]);
  const currentBranchIdeas = useAppSelector(selectCurrentBranchIdeas);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [baseDaemon] = useState(new BaseDaemon(baseDaemonConfig));
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);

  const getNewCompletions = useCallback(async () => {
    if (currentBranchIdeas.length === 0 || !openAIKey) return;
    try {
      const completions = await baseDaemon.getCompletions(currentBranchIdeas, openAIKey, openAIOrgId, baseModel);
      setCompletions(completions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatchError(error.toString());
      } else {
        dispatchError('An unknown error occurred');
      }
    }
  }, [currentBranchIdeas, baseDaemon, openAIKey, openAIOrgId, baseModel]);

  useEffect(() => {
    getNewCompletions();
  }, [currentBranchIdeas, baseDaemon, openAIKey, openAIOrgId, baseModel]);

  return (
    <TopLevelContainer>
      <BackgroundContainer>
        <ContainerHorizontal>
          <h4>Base model completions</h4>
          <Filler />
          <TextButton onClick={getNewCompletions}>Refresh</TextButton>
        </ContainerHorizontal>
        {completions.length === 0 &&
          <Hint>Here you will see how the base model would continue your train of thought</Hint>
        }
        <StyledCompletionsContainer>
          {completions.map((completion, index) => (
            <StyledIndividualCompletion key={index}>
              {completion}
            </StyledIndividualCompletion>
          ))}
        </StyledCompletionsContainer>
      </BackgroundContainer>
    </TopLevelContainer>
  )
}

export default CompletionsContainer;