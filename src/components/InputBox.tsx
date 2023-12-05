import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

// Component
const TextAreaField = styled.textarea`
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; // Change this line
  height: 100%;
  margin: auto;
  display: block;
  background-color: #2c3038;
  color: #ffffff;
  overflow: hidden;
  resize: none;
  &:focus {
    outline: none;
    border-color: #6c757d; 
  }
`;

const InputBox = () => {
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

  useEffect(() => {
    resizeTextArea();
  }, []);

  return (
    <TextAreaField 
      ref={textAreaRef} 
      placeholder="Enter text here..." 
      onChange={handleTextChange}
    />
  );
};

export default InputBox;