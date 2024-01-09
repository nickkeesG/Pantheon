import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { addIdea, addNode, setLastTimeActive } from '../redux/textSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Button, TextArea } from '../styles/sharedStyles';

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

const NewNodeButton = styled(Button)`
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 20px;
  color: var(--text-color-dark);
  border-color: var(--line-color-dark);
`;

const InputBox = () => {
  const dispatch = useAppDispatch();
  const newNodeButtonDisabled = useAppSelector(state => state.text.currentBranchIds.length === 0)
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
        dispatch(addIdea({ text: textAreaRef.current.value }));
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
      <NewNodeButton 
        onClick={() => dispatch(addNode())}
        disabled={newNodeButtonDisabled}
        >
          + Start a new page
          </NewNodeButton>
    </Container>
  );
};

export default InputBox;