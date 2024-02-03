import { useState, useEffect, useCallback} from 'react';
import {selectCurrentBranchIdeas} from '../../../redux/ideaSlice';
import styled from 'styled-components';
import { useAppSelector } from '../../../hooks';
import { GenerateBaseCompletions } from '../../../llmHandler';
import { dispatchError } from '../../../errorHandler';

const StyledCompletionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const Column = styled.div`
  text-align: center; /* Center the text */
`;

const StyledIndividualCompletion = styled.div`
  position: relative;
  flex: 1;
  padding: 10px 28px 10px 10px;
  margin: 2px 0px;
  border: 0.5px solid var(--line-color-dark);
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
`;

const getContext = (currentBranchIdeas: { text: string }[]) => {
  var context = currentBranchIdeas.map(idea => idea.text).join('\n');
  context += '\n';
  return context;
}

const CompletionsContainer = () => {
  const [completions, setCompletions] = useState<string[]>([]);
  const currentBranchIdeas = useAppSelector(selectCurrentBranchIdeas);
  const lastTimeActive = useAppSelector(state => state.ui.lastTimeActive);
  const [contextUpToDate, setContextUpToDate] = useState(true);
  const [alreadyGettingCompletions, setAlreadyGettingCompletions] = useState(false);

  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const baseModel = useAppSelector(state => state.config.baseModel);

  const getNewCompletions = useCallback(async() => {
    setAlreadyGettingCompletions(true);
    try {
      const context = getContext(currentBranchIdeas);
      const completions = await GenerateBaseCompletions(context, openAIKey, openAIOrgId, baseModel);
      setCompletions(completions);
    } catch (error) {
      dispatchError(error);
    }

    setAlreadyGettingCompletions(false);
    setContextUpToDate(true);
  }, [currentBranchIdeas, openAIKey, openAIOrgId, baseModel]);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
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
            <StyledIndividualCompletion key={index}>
              {completion}
            </StyledIndividualCompletion>
          ))}
        </Column>
      );
    }
    return columns;
  };

  return (
    <StyledCompletionsContainer onClick={handleContainerClick}>
      {renderColumns()}
    </StyledCompletionsContainer>
  )
}

export default CompletionsContainer;