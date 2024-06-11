import React, { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../../hooks';
import { TextArea } from '../../../styles/sharedStyles';
import { createIdea } from '../../../redux/thunks';
import { setLastTimeActive } from '../../../redux/uiSlice';


const TextAreaField = styled(TextArea)`
  width: 46%;
  font-size: 16px;
  overflow: hidden;
  resize: none;
  margin-bottom: 12px;
`;

interface InputBoxProps {
  // TODO This should be a thunk that InputBox dispatches directly
  dispatchInstruction: (instruction: string) => void;
}

export interface InputBoxHandle {
  getText: () => string;
  clearAndScrollToView: () => void;
}

const InputBox = forwardRef<InputBoxHandle, InputBoxProps>(({ dispatchInstruction }, ref) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  const resize = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [textAreaRef]);

  const clearAndScrollToView = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
      resize();
      textAreaRef.current.scrollIntoView();
    }
  }, [textAreaRef, resize]);

  useImperativeHandle(ref, () => ({
    getText: () => {
      return textAreaRef.current ? textAreaRef.current.value : '';
    },
    clearAndScrollToView: clearAndScrollToView
  }));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    dispatch(setLastTimeActive())
    if (event.key === 'Enter') {
      // TODO Allow line breaks with Shift+Enter
      event.preventDefault(); // Prevents the addition of a new line
      if (textAreaRef.current && textAreaRef.current.value.trim() !== '') {
        if (event.ctrlKey) { // Treat text as instruction
          dispatchInstruction(textAreaRef.current.value);
        } else { // Save the text to the history
          dispatch(createIdea(textAreaRef.current.value));
        }
        clearAndScrollToView();
      }
    }
  };

  return (
    <TextAreaField
      ref={textAreaRef}
      placeholder="Enter text here..."
      onChange={resize}
      onKeyDown={handleKeyDown}
    />
  );
});

export default InputBox;