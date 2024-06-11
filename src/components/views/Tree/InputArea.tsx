import styled from "styled-components";
import InputBox, { InputBoxHandle } from "./InputBox";
import { Button, ContainerHorizontal, ContainerVertical } from "../../../styles/sharedStyles";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setCreatingSection } from "../../../redux/uiSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import InstructDaemon from "../../../daemons/instructDaemon";
import { selectCurrentBranchThoughts } from "../../../redux/ideaSlice";
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
  const newSectionButtonDisabled = useAppSelector(state => state.ui.activeIdeaIds.length === 0)
  const instructDaemonConfig = useAppSelector(state => state.daemon.instructDaemon);
  const [instructDaemon, setInstructDaemon] = useState<InstructDaemon>(new InstructDaemon(instructDaemonConfig));
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const instructModel = useAppSelector(state => state.config.chatModel); // using the chat model

  // Instuct daemon can only see thoughts, and the most recent instruction (no past instructions or responses)
  const currentBranchIdeas = useAppSelector(selectCurrentBranchThoughts);

  useEffect(() => {
    setInstructDaemon(new InstructDaemon(instructDaemonConfig));
  }, [instructDaemonConfig]);

  // TODO This should be a thunk
  const dispatchInstruction = useCallback(async (instruction: string) => {
    // dispatch instruction as idea but set type to "instruction"
    dispatch(createIdea(instruction, IdeaType.InstructionToAi));

    if (instructDaemon) {
      try {
        const response = await instructDaemon.handleInstruction(
          currentBranchIdeas,
          instruction,
          openAIKey,
          openAIOrgId,
          instructModel);
        if (response) {
          dispatch(createIdea(response, IdeaType.ResponseFromAi)); // flag idea as response to instruction
        } else {
          dispatchError('Instruct daemon failed to generate response');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [instructDaemon, openAIKey, openAIOrgId, instructModel, currentBranchIdeas, dispatch]);

  return (
    <ContainerVertical>
      <InputBox ref={textAreaRef} dispatchInstruction={dispatchInstruction} />
      <ButtonRow>
        <Button
          onClick={() => dispatch(setCreatingSection(true))}
          disabled={newSectionButtonDisabled}
        >
          + New section
        </Button>
        <Button
          onClick={() => {
            if (textAreaRef.current) {
              const text = textAreaRef.current.getText();
              if (text.trim() !== '') {
                dispatchInstruction(text);
                textAreaRef.current.clearAndScrollToView();
              }
            }
          }}
          title="Press Ctrl + Enter to send text to instruct daemon"
        >
          Send idea to instruct daemon
        </Button>
      </ButtonRow>
    </ContainerVertical>
  )
};

export default InputArea;

