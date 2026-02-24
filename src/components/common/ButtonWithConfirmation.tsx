import { useModal } from "../ModalContext";
import ConfirmationModal from "./ConfirmationModal";

interface ButtonWithConfirmationProps extends React.PropsWithChildren {
	confirmationText: string;
	onConfirm: () => void;
}

const ButtonWithConfirmation: React.FC<ButtonWithConfirmationProps> = ({
	confirmationText,
	onConfirm,
	children,
}) => {
	const { addModal, removeModal } = useModal();

	const onClick = () => {
		addModal(
			<ConfirmationModal
				onConfirm={confirmSelected}
				onCancel={removeModal}
				message={confirmationText}
			/>,
		);
	};

	const confirmSelected = () => {
		removeModal();
		onConfirm();
	};

	return (
		<button type="button" onClick={onClick} style={{ all: "unset" }}>
			{children}
		</button>
	);
};

export default ButtonWithConfirmation;
