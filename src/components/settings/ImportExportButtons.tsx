import styled from "styled-components";
import { Button, ButtonHighlighted } from "../../styles/sharedStyles";
import { LuImport } from "react-icons/lu";
import { PiExportBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { replaceTree } from "../../redux/textSlice";
import React from "react";


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
  const dispatch = useDispatch();
  const textState = useSelector((state: RootState) => state.text);

  const importStateFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          try {
            const importedState = JSON.parse(text);
            dispatch(replaceTree(importedState));
            // TODO Notify the user that the import was successful
          } catch (error) {
            console.error('Error parsing the imported file', error);
          }
        }
      }
      reader.readAsText(file);
    }
  }

  const exportStateToJson = () => {
    const serializedState = JSON.stringify(textState);
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
    <ButtonsContainer>
      <StyledButtonHighlighted as="label">
        Import
        <input type="file"
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
  )
}

export default ImportExportButtons;