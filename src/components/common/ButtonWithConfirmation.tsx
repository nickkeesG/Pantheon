import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

interface ButtonWithConfirmationProps extends React.PropsWithChildren {
  confirmationText: string,
  onConfirm: () => void;
}

// TODO Make use ModalContext
const ButtonWithConfirmation: React.FC<ButtonWithConfirmationProps> = ({ confirmationText, onConfirm, children }) => {
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
      <div onClick={toggleConfirmationModal}>
        {children}
      </div>
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