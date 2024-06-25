import React from 'react';
import styled from 'styled-components';
import { Button, ButtonDangerous, ModalBox } from '../../styles/sharedStyles';

const ConfirmationMessage = styled.p`
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ConfirmationModal: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => {
  return (
    <ModalBox>
      <ConfirmationMessage>{message}</ConfirmationMessage>
      <ButtonGroup>
        <ButtonDangerous onClick={onConfirm} >
          Confirm
        </ButtonDangerous>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    </ModalBox>
  );
};

export default ConfirmationModal;