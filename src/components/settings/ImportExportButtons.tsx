import styled from "styled-components";
import { Button, ButtonHighlighted, ContainerVertical, Hint } from "../../styles/sharedStyles";
import { LuImport } from "react-icons/lu";
import { PiExportBold } from "react-icons/pi";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { importAppState } from "../../redux/thunks";


const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const StyledButtonHighlighted = styled(ButtonHighlighted)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ImportExportButtons = () => {
  const dispatch = useAppDispatch();
  const treeState = useAppSelector(state => state.tree);
  const sectionState = useAppSelector(state => state.section);
  const ideaState = useAppSelector(state => state.idea);
  const commentState = useAppSelector(state => state.comment);
  const daemonState = useAppSelector(state => state.daemon);
  const configState = useAppSelector(state => state.config);

  const importStateFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          dispatch(importAppState(text));
        }
      }
      reader.readAsText(file);
    }
  }

  const exportStateToJson = () => {
    const serializedState = JSON.stringify({
      tree: treeState,
      section: sectionState,
      idea: ideaState,
      comment: commentState,
      daemon: daemonState,
      config: configState
    });
    const blob = new Blob([serializedState], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pantheonState.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <ContainerVertical>
      <Hint>
        Import or export entire app state, including trees, comments, daemons and settings.
        Importing will override the existing state and cannot be undone.
      </Hint>
      <ButtonsContainer>
        <StyledButtonHighlighted
          onClick={(e) => (e.currentTarget.children[0] as HTMLInputElement).click()}>
          Import
          <input
            type="file"
            accept=".json"
            onChange={importStateFromJson}
            style={{ display: 'none' }} />
          <LuImport style={{ fontSize: '20px' }} />
        </StyledButtonHighlighted>
        <StyledButton onClick={exportStateToJson}>
          Export
          <PiExportBold style={{ fontSize: '18px' }} />
        </StyledButton>
      </ButtonsContainer>
    </ContainerVertical>
  )
}

export default ImportExportButtons;