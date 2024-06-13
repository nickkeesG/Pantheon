import React, { useRef, useCallback, forwardRef, useImperativeHandle, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Hint, TextArea } from '../../../styles/sharedStyles';
import { createIdea } from '../../../redux/thunks';
import { setLastTimeActive } from '../../../redux/uiSlice';
import TextWithHighlights from '../../common/TextWithHighlights';
import { findDaemonMention } from '../../../redux/storeUtils';
import { fadeInAnimation } from '../../../styles/mixins';


const TextAreaField = styled(TextArea)`
  width: 100%;
  font-size: 16px;
  overflow: hidden;
  resize: none;
  margin: 0px 0px 12px 0px;
  padding-bottom: 20px;
`;

const MentionHint = styled(Hint)`
  position: absolute;
  bottom: 16px;
  left: 10px;
  ${fadeInAnimation};
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
  const [mentionedDaemon, setMentionedDaemon] = useState<string | null>(null);
  const chatDaemons = useAppSelector((state) => state.daemon.chatDaemons);
  const enabledDaemons = useMemo(() => chatDaemons.filter((daemon) => daemon.enabled), [chatDaemons]);

  const resize = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [textAreaRef]);

  const clearAndScrollToView = useCallback(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
      setMentionedDaemon(null);
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

  const checkForMentions = () => {
    if (textAreaRef.current) {
      if (textAreaRef.current.value.trim() === '') {
        setMentionedDaemon(null);
      } else {
        setMentionedDaemon(findDaemonMention(textAreaRef.current.value, enabledDaemons));
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    dispatch(setLastTimeActive())
    if (event.key === 'Enter' && !event.shiftKey) {
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
    <div style={{ position: 'relative', width: '46%' }}>
      <TextAreaField
        ref={textAreaRef}
        placeholder="Enter text here..."
        onChange={() => {
          resize();
          checkForMentions();
        }}
        onKeyDown={handleKeyDown}
      />
      {mentionedDaemon && (
        <MentionHint>
          <TextWithHighlights text={`Pings ${mentionedDaemon}.`} highlights={[[6, 6 + mentionedDaemon.length]]} />
        </MentionHint>
      )}
    </div>
  );
});

export default InputBox;