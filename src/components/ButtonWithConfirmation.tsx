import { useState } from "react";
import { ButtonDangerous } from "../styles/sharedStyles"
import ConfirmationModal from "./ConfirmationModal";

interface ButtonWithConfirmationProps {
  buttonText: string,
  confirmationText: string,
  onConfirm: () => void;
}

const ButtonWithConfirmation: React.FC<ButtonWithConfirmationProps> = ({ buttonText, confirmationText, onConfirm }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  }

  const confirmSelected = () => {
    toggleConfirmationModal();
    onConfirm();
  }

  return (
    <>
      <ButtonDangerous onClick={toggleConfirmationModal}>
        {buttonText}
      </ButtonDangerous>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          onConfirm={confirmSelected}
          onCancel={toggleConfirmationModal}
          message={confirmationText}
          zIndex={120}
        />
      )}
    </>
  )
}

export default ButtonWithConfirmation;