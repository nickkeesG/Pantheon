import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Button, TextArea } from '../styles/sharedStyles';
import { createIdea, createPage } from '../redux/thunks';
import { setLastTimeActive } from '../redux/uiSlice';

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

  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleTextChange = () => {
    resizeTextArea();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    dispatch(setLastTimeActive())
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the addition of a new line

      //Save the text to the history
      if (textAreaRef.current && textAreaRef.current.value.trim() !== '') {
        dispatch(createIdea(textAreaRef.current.value));
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