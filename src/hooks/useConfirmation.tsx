import { useCallback } from "react";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useModal } from "../components/ModalContext";

export function useConfirmation() {
	const { addModal, removeModal } = useModal();

	return useCallback(
		(message: string, onConfirm: () => void) => {
			addModal(
				<ConfirmationModal
					message={message}
					onConfirm={() => {
						removeModal();
						onConfirm();
					}}
					onCancel={removeModal}
				/>,
			);
		},
		[addModal, removeModal],
	);
}
