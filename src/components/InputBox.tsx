import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { addIdea, setLastTimeActive } from '../redux/textSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { TextArea } from '../styles/SharedStyles';

const Centered = styled.div`
  width: 40%;
  margin: auto;
`

const TextAreaField = styled(TextArea)`
  font-size: 16px;
  overflow: hidden;
  resize: none;
`;

const InputBox = () => {
  const currentParentIdeaId = useAppSelector(state => state.text.currentIdea?.id ?? null)
  const dispatch = useAppDispatch();
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
        dispatch(addIdea({ parentIdeaId: currentParentIdeaId, text: textAreaRef.current.value }));
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
    <Centered>
      <TextAreaField
        ref={textAreaRef}
        placeholder="Enter text here..."
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
      />
    </Centered>
  );
};

export default InputBox;