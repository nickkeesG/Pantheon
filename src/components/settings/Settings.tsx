import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { useAppDispatch } from "../../hooks";
import { resetDaemonSlice } from "../../redux/daemonSlice";
import { resetState } from "../../redux/thunks";
import {
	Button,
	ButtonDangerous,
	Hint,
	IconButtonMedium,
} from "../../styles/sharedStyles";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "../ui/Dialog";
import AISuggestionsSettings from "./AISuggestionsSettings";
import ConfigSettings from "./ConfigSettings";
import DaemonSettings from "./DaemonSettings";
import ImportExportButtons from "./ImportExportButtons";
import ThemeSettings from "./ThemeSettings";

const SettingsModalContent = () => {
	const dispatch = useAppDispatch();
	const [key, setKey] = useState(Date.now());

	const resetDaemonSettings = () => {
		dispatch(resetDaemonSlice());
		setKey(Date.now());
	};

	const resetAppState = () => {
		dispatch(resetState());
		setKey(Date.now());
	};

	return (
		<div className="space-y-8">
			<DialogTitle className="text-center">Settings</DialogTitle>
			<DialogDescription className="sr-only">
				Application settings
			</DialogDescription>
			<ConfigSettings />
			<DaemonSettings key={key} />
			<AISuggestionsSettings />
			<ThemeSettings />
			<ImportExportButtons />
			<div className="p-4 bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900 rounded-lg">
				<h4>Danger zone</h4>
				<Hint>
					Reset all daemon settings back to default. All custom daemons, and
					edits made to default daemons, will be lost.
				</Hint>
				<div style={{ display: "flex" }}>
					<Dialog>
						<DialogTrigger asChild>
							<ButtonDangerous>Reset daemon settings</ButtonDangerous>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle className="sr-only">Confirm reset</DialogTitle>
							<DialogDescription className="mb-5">
								Are you sure you want to reset all daemon settings? This cannot
								be undone.
							</DialogDescription>
							<div className="flex justify-around">
								<DialogClose asChild>
									<ButtonDangerous onClick={resetDaemonSettings}>
										Confirm
									</ButtonDangerous>
								</DialogClose>
								<DialogClose asChild>
									<Button>Cancel</Button>
								</DialogClose>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<div className="mt-4" />
				<Hint>
					Reset the entire app state back to default. All ideas, comments, and
					custom daemons will be lost.
				</Hint>
				<div style={{ display: "flex" }}>
					<Dialog>
						<DialogTrigger asChild>
							<ButtonDangerous>Reset entire app state</ButtonDangerous>
						</DialogTrigger>
						<DialogContent>
							<DialogTitle className="sr-only">Confirm reset</DialogTitle>
							<DialogDescription className="mb-5">
								Are you sure you want to reset the entire app state? All
								progress will be lost. This cannot be undone.
							</DialogDescription>
							<div className="flex justify-around">
								<DialogClose asChild>
									<ButtonDangerous onClick={resetAppState}>
										Confirm
									</ButtonDangerous>
								</DialogClose>
								<DialogClose asChild>
									<Button>Cancel</Button>
								</DialogClose>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
};

const Settings = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<IconButtonMedium title="Settings">
					<FiSettings />
				</IconButtonMedium>
			</DialogTrigger>
			<DialogContent className="w-[min(640px,90vw)]">
				<SettingsModalContent />
			</DialogContent>
		</Dialog>
	);
};

export default Settings;
