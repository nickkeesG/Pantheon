import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Button, TextArea } from '../../../styles/sharedStyles';
import { createIdea } from '../../../redux/thunks';
import { setCreatingSection, setLastTimeActive } from '../../../redux/uiSlice';
import InstructDaemon from '../../../daemons/instructDaemon';
import { dispatchError } from '../../../errorHandler';
import { selectCurrentBranchIdeas } from '../../../redux/ideaSlice';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const TextAreaField = styled(TextArea)`
  width: 46%;
  font-size: 16px;
  overflow: hidden;
  resize: none;
  margin-bottom: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px; // Adjust the gap between buttons as needed
`;

const NewSectionButton = styled(Button)`
  padding-left: 20px;
  padding-right: 20px;
  color: var(--text-color-dark);
  border-color: var(--line-color-dark);
`;

const InstructButton = styled(Button)`
  padding-left: 20px;
  padding-right: 20px;
  color: var(--text-color-dark);
  border-color: var(--line-color-dark);
`;

const InputBox = () => {
  const dispatch = useAppDispatch();
  const newSectionButtonDisabled = useAppSelector(state => state.ui.activeIdeaIds.length === 0)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const instructDaemonConfig = useAppSelector(state => state.daemon.instructDaemon);
  const [instructDaemon, setInstructDaemon] = useState<InstructDaemon | null>(null);
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const instructModel = useAppSelector(state => state.config.chatModel); // using the chat model
  const currentBranchIdeas = useAppSelector(selectCurrentBranchIdeas);

  useEffect(() => {
    const daemon = instructDaemonConfig ? new InstructDaemon(instructDaemonConfig) : null;
    setInstructDaemon(daemon);
  }, [instructDaemonConfig]);

  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleTextChange = () => {
    resizeTextArea();
  };

  const dispatchInstruction = useCallback(async (instruction: string) => {
    // dispatch instruction as idea but flag isUser as false
    dispatch(createIdea(instruction, false));

    if (instructDaemon) {
      try {
        const response = await instructDaemon.handleInstruction(
          currentBranchIdeas,
          instruction,
          openAIKey,
          openAIOrgId,
          instructModel);
        if (response) {
          dispatch(createIdea(response, false)); // false flags isUser as false
        } else {
          dispatchError('Instruct daemon failed to generate response');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [instructDaemon, openAIKey, openAIOrgId, instructModel, currentBranchIdeas, dispatch]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    dispatch(setLastTimeActive())
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the addition of a new line

      if (textAreaRef.current && textAreaRef.current.value.trim() !== '') {
        if (event.ctrlKey) { // Treat text as instruction
          dispatchInstruction(textAreaRef.current.value);
        } else { // Save the text to the history
          dispatch(createIdea(textAreaRef.current.value));
        }
        textAreaRef.current.scrollIntoView();
      }

      if (textAreaRef.current) {
        textAreaRef.current.value = '';
        resizeTextArea();
      }
    }
  };

  useEffect(() => {
    resizeTextArea();
  }, []);

  return (
    <Container>
      <TextAreaField
        ref={textAreaRef}
        placeholder="Enter text here..."
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
      <ButtonRow>
        <NewSectionButton
          onClick={() => dispatch(setCreatingSection(true))}
          disabled={newSectionButtonDisabled}
        >
          + New section
        </NewSectionButton>
        <InstructButton
          onClick={() => {
            if (textAreaRef.current && textAreaRef.current.value.trim() !== '') {
              dispatchInstruction(textAreaRef.current.value);
              textAreaRef.current.value = ''; // Clear the text area
              resizeTextArea(); // Resize the text area
            }
          }}
          title="Press Ctrl + Enter to send text to the instruct daemon."
        >
          Send idea to instruct daemon
        </InstructButton>
      </ButtonRow>
    </Container>
  );
};

export default InputBox;