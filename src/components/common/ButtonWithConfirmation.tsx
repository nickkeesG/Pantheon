import ConfirmationModal from "./ConfirmationModal";
import { useModal } from "../ModalContext";

interface ButtonWithConfirmationProps extends React.PropsWithChildren {
  confirmationText: string,
  onConfirm: () => void;
}

const ButtonWithConfirmation: React.FC<ButtonWithConfirmationProps> = ({ confirmationText, onConfirm, children }) => {
  const { addModal, removeModal } = useModal();

  const onClick = () => {
    addModal(<ConfirmationModal onConfirm={confirmSelected} onCancel={removeModal} message={confirmationText} />);
  }

  const confirmSelected = () => {
    removeModal();
    onConfirm();
  }

  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}

export default ButtonWithConfirmation;