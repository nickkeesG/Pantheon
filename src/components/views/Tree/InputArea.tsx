import styled from "styled-components";
import InputBox, { InputBoxHandle } from "./InputBox";
import { Button, ContainerHorizontal, ContainerVertical } from "../../../styles/sharedStyles";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setCreatingSection } from "../../../redux/uiSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import InstructDaemon from "../../../daemons/instructDaemon";
import { selectActiveBranch, selectActiveThoughts } from "../../../redux/ideaSlice";
import { createIdea } from "../../../redux/thunks";
import { IdeaType } from "../../../redux/models";
import { dispatchError } from "../../../errorHandler";


const ButtonRow = styled(ContainerHorizontal)`
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const InputArea = () => {
  const dispatch = useAppDispatch();
  const textAreaRef = useRef<InputBoxHandle>(null);
  const [textAreaText, setTextAreaText] = useState('');
  const activeIdeaIds = useAppSelector(state => state.ui.activeIdeaIds);
  const isCreatingSection = useAppSelector(state => state.ui.creatingSection);
  const [newSectionButtonDisabled, setNewSectionButtonDisabled] = useState(true);
  const instructDaemonConfig = useAppSelector(state => state.daemon.instructDaemon);
  const [instructDaemon, setInstructDaemon] = useState<InstructDaemon>(new InstructDaemon(instructDaemonConfig));
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const instructModel = useAppSelector(state => state.config.chatModel);
  const activeBranch = useAppSelector(selectActiveBranch);

  useEffect(() => {
    setInstructDaemon(new InstructDaemon(instructDaemonConfig));
  }, [instructDaemonConfig]);

  useEffect(() => {
    setNewSectionButtonDisabled(activeIdeaIds.length === 0 || isCreatingSection === true);
  }, [activeIdeaIds, isCreatingSection]);

  const updateText = useCallback(() => {
    if (textAreaRef.current) {
      setTextAreaText(textAreaRef.current.getText());
    } else {
      setTextAreaText('');
    }
  }, [])

  const dispatchIdea = useCallback(() => {
    dispatch(createIdea(textAreaText))
    textAreaRef.current?.clearAndScrollToView();
    updateText();
  }, [dispatch, textAreaText, textAreaRef, updateText]);

  const dispatchInstruction = useCallback(async () => {
    dispatch(createIdea(textAreaText, IdeaType.InstructionToAi));
    textAreaRef.current?.clearAndScrollToView();
    updateText();

    if (instructDaemon) {
      try {
        const response = await instructDaemon.handleInstruction(
          activeBranch,
          textAreaText,
          openAIKey,
          openAIOrgId,
          instructModel);
        if (response && response.length > 0) {
          dispatch(createIdea(response[0], IdeaType.ResponseFromAi));
        } else {
          dispatchError('Ask AI failed to generate response');
        }
      } catch (error) {
        dispatchError("Unknown error from Ask AI")
        console.error(error);
      }
    }
  }, [instructDaemon, openAIKey, openAIOrgId, instructModel, activeBranch, dispatch, textAreaText, updateText]);

  return (
    <ContainerVertical style={{ alignItems: 'center', justifyContent: 'center' }}>
      <InputBox
        ref={textAreaRef}
        dispatchIdea={dispatchIdea}
        dispatchInstruction={dispatchInstruction}
        onChange={updateText}
      />
      <ButtonRow>
        <Button
          onClick={() => dispatch(setCreatingSection(true))}
          disabled={newSectionButtonDisabled}>
          + New section
        </Button>
        <Button
          disabled={textAreaText.trim() === ''}
          onClick={dispatchInstruction}
          title="Ask a question directly, ChatGPT style. Hotkey: Ctrl + Enter">
          Ask AI
        </Button>
      </ButtonRow>
    </ContainerVertical>
  )
};

export default InputArea;

