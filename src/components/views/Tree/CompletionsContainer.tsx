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

const Column = styled.div`
  text-align: center; /* Center the text */
  width: 100%;
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
  const lastTimeActive = useAppSelector(state => state.ui.lastTimeActive);
  const [contextUpToDate, setContextUpToDate] = useState(true);
  const [alreadyGettingCompletions, setAlreadyGettingCompletions] = useState(false);
  
  const [baseDaemon, setBaseDaemon] = useState<BaseDaemon | null>(null);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  const getNewCompletions = useCallback(async () => {
    setAlreadyGettingCompletions(true);
    try {
      if (!baseDaemon) {
        throw new Error('Base daemon not initialized');
      }
      const completions = await baseDaemon.getCompletions(currentBranchIdeas, openAIKey, openAIOrgId, baseModel);
      setCompletions(completions);
    } catch (error) {
      dispatchError(error);
    }

    setAlreadyGettingCompletions(false);
    setContextUpToDate(true);
  }, [currentBranchIdeas, baseDaemon, openAIKey, openAIOrgId, baseModel]);

  const handleContainerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const emptyCompletions: string[] = [];
    setCompletions(emptyCompletions);
    if (currentBranchIdeas.length > 0) {
      getNewCompletions();
    }
  };

  useEffect(() => {
    if (currentBranchIdeas.length > 0) {
      setContextUpToDate(false);
    }
    else {
      const emptyCompletions: string[] = [];
      setCompletions(emptyCompletions);
    }
  }, [currentBranchIdeas]);

  useEffect(() => {
    const maxTimeInactive = 3; // seconds
    const interval = setInterval(() => {
      if (!alreadyGettingCompletions) {
        if (!contextUpToDate && (Date.now() - lastTimeActive) > maxTimeInactive * 1000) {
          if (openAIKey && baseModel) {
            getNewCompletions();
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [contextUpToDate, lastTimeActive, alreadyGettingCompletions, openAIKey, baseModel, getNewCompletions]);

  const renderColumns = () => {
    // Split the completions into chunks of 2 for each column
    const chunkSize = 2;
    const columns = [];
    for (let i = 0; i < completions.length; i += chunkSize) {
      const chunk = completions.slice(i, i + chunkSize);
      columns.push(
        <Column key={i}>
          {chunk.map((completion, index) => (
            <StyledIndividualCompletion key={completion + index}>
              {completion}
            </StyledIndividualCompletion>
          ))}
        </Column>
      );
    }
    return columns;
  };

  return (
    <TopLevelContainer>
      <BackgroundContainer>
        <ContainerHorizontal>
          <h4>Base model completions</h4>
          <Filler />
          <TextButton onClick={handleContainerClick}>Refresh</TextButton>
        </ContainerHorizontal>
        {completions.length === 0 &&
          <Hint>Here you will see how the base model would continue your train of thought</Hint>
        }
        <StyledCompletionsContainer>
          {completions.length > 0 &&
            renderColumns()
          }

        </StyledCompletionsContainer>
      </BackgroundContainer>
    </TopLevelContainer>
  )
}

export default CompletionsContainer;