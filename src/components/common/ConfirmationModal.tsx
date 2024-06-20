import React from 'react';
import styled from 'styled-components';
import { Button, ButtonDangerous } from '../../styles/sharedStyles';

const ConfirmationContent = styled.div`
  background: var(--bg-color);
  padding: 20px 44px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
`;

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
  zIndex?: number;
}> = ({ message, onConfirm, onCancel, zIndex }) => {
  return (
    <ConfirmationContent>
      <ConfirmationMessage>{message}</ConfirmationMessage>
      <ButtonGroup>
        <ButtonDangerous onClick={onConfirm} >
          Confirm
        </ButtonDangerous>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    </ConfirmationContent>
  );
};

export default ConfirmationModal;