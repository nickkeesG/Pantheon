import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useAppDispatch } from "../../hooks";
import {
	ButtonDangerous,
	Hint,
	IconButtonMedium,
	ModalBox,
} from "../../styles/sharedStyles";
import Modal from "../common/Modal";
import ConfigSettings from "./ConfigSettings";
import AISuggestionsSettings from "./AISuggestionsSettings";
import DaemonSettings from "./DaemonSettings";
import ImportExportButtons from "./ImportExportButtons";
import ButtonWithConfirmation from "../common/ButtonWithConfirmation";
import { resetState } from "../../redux/thunks";
import { resetDaemonSlice } from "../../redux/daemonSlice";
import ThemeSettings from "./ThemeSettings";
import { useModal } from "../ModalContext";

const Settings = () => {
	const dispatch = useAppDispatch();
	const [key, setKey] = useState(Date.now()); // Key modifier for UI reset
	const { addModal } = useModal();

	const openSettings = () => {
		addModal(
			<Modal>
				<ModalBox style={{ width: "90vw", maxWidth: "640px" }}>
					<div className="space-y-8">
						<h3 className="text-center">Settings</h3>
						<ConfigSettings />
						<DaemonSettings key={key} />
						<AISuggestionsSettings />
						<ThemeSettings />
						<ImportExportButtons />
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
							<h4>Danger zone</h4>
							<Hint>
								Reset all daemon settings back to default. All custom daemons,
								and edits made to default daemons, will be lost.
							</Hint>
							<div style={{ display: "flex" }}>
								<ButtonWithConfirmation
									confirmationText="Are you sure you want to reset all daemon settings? This cannot be undone."
									onConfirm={resetDaemonSettings}
								>
									<ButtonDangerous>Reset daemon settings</ButtonDangerous>
								</ButtonWithConfirmation>
							</div>
							<div className="mt-4" />
							<Hint>
								Reset the entire app state back to default. All ideas, comments,
								and custom daemons will be lost.
							</Hint>
							<div style={{ display: "flex" }}>
								<ButtonWithConfirmation
									confirmationText="Are you sure you want to reset the entire app state? All progress will be lost. This cannot be undone."
									onConfirm={resetAppState}
								>
									<ButtonDangerous>Reset entire app state</ButtonDangerous>
								</ButtonWithConfirmation>
							</div>
						</div>
					</div>
				</ModalBox>
			</Modal>,
		);
	};

	const resetDaemonSettings = () => {
		dispatch(resetDaemonSlice());
		setKey(Date.now());
	};

	const resetAppState = () => {
		dispatch(resetState());
		setKey(Date.now());
	};

	return (
		<IconButtonMedium title="Settings" onClick={openSettings}>
			<FiSettings />
		</IconButtonMedium>
	);
};

export default Settings;
