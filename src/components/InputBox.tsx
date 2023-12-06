import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addIdea } from '../redux/textSlice';

const Centered = styled.div`
  width: 60%;
  margin: auto;
`

const TextAreaField = styled.textarea`
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  border: 1px solid var(--line-color);
  border-radius: 4px;
  width: 100%; // Change this line
  height: 100%;
  margin: auto;
  display: block;
  background-color: var(--bg-color-light);
  color: var(--text-color);
  overflow: hidden;
  resize: none;
  &:focus {
    outline: none;
    border-color: var(--line-color-light); 
  }
`;

const InputBox = () => {
  const dispatch = useDispatch();
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
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents the addition of a new line

      //Save the text to the history
      if (textAreaRef.current) {
        dispatch(addIdea(textAreaRef.current.value));
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