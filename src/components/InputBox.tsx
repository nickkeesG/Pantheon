import React, { useRef, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Button, TextArea } from '../styles/sharedStyles';
import { createIdea, createPage } from '../redux/thunks';
import { setLastTimeActive } from '../redux/uiSlice';
import InstructDaemon from '../daemons/instructDaemon';
import { dispatchError } from '../errorHandler';

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

const NewPageButton = styled(Button)`
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  color: var(--text-color-dark);
  border-color: var(--line-color-dark);
`;

const InputBox = () => {
  const dispatch = useAppDispatch();
  const newPageButtonDisabled = useAppSelector(state => state.ui.activeIdeaIds.length === 0)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const instructDaemonConfig = useAppSelector(state => state.daemon.instructDaemon);
  const [instructDaemon, setInstructDaemon] = useState<InstructDaemon | null>(null);
  const openAIKey = useAppSelector(state => state.llm.openAIKey);
  const openAIOrgId = useAppSelector(state => state.llm.openAIOrgId);
  const instructModel = useAppSelector(state => state.llm.chatModel); // using the chat model

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
    if (instructDaemon) {
      try {
        const response = await instructDaemon.handleInstruction([], 
                                                                [], 
                                                                instruction, 
                                                                openAIKey, 
                                                                openAIOrgId, 
                                                                instructModel);
        if (response) {
          dispatch(createIdea(response));
        } else {
          dispatchError('Instruct daemon failed to generate response');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [instructDaemon, openAIKey, openAIOrgId, instructModel, dispatch]);

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
      <NewPageButton
        onClick={() => dispatch(createPage())}
        disabled={newPageButtonDisabled}
      >
        + Start a new page
      </NewPageButton>
    </Container>
  );
};

export default InputBox;