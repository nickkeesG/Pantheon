import type React from "react";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useAppSelector } from "./hooks";
import { selectLatestError } from "./redux/errorSlice";
import { store } from "./redux/store";

export function dispatchError(error: string | Error) {
	store.dispatch({ type: "error/addError", payload: error });
}

const ErrorDisplay: React.FC = () => {
	const latestError = useAppSelector(selectLatestError);
	const [showError, setShowError] = useState<boolean>(false);
	const latestErrorTime = useAppSelector(
		(state) => state.error.latestErrorTime,
	);
	const maxTimeErrorVisible = 10; // seconds

	useEffect(() => {
		if (latestErrorTime) {
			const timeSinceLatestError = Date.now() - latestErrorTime;
			if (timeSinceLatestError < maxTimeErrorVisible * 1000) {
				setShowError(true);
				const timer = setTimeout(
					() => {
						setShowError(false);
					},
					maxTimeErrorVisible * 1000 - timeSinceLatestError,
				);

				return () => clearTimeout(timer);
			}
		}
	}, [latestErrorTime]);

	if (!showError) {
		return null;
	}

	return (
		<div className="fixed z-50 text-[var(--accent-color-red)] bg-[var(--bg-color-secondary)] bottom-4 left-4 border-[0.5px] border-[var(--accent-color-red)] rounded py-2.5 pl-2.5 pr-7 m-1">
			<FiX
				className="w-3 h-3 p-1 absolute top-1 right-1 cursor-pointer inline-flex items-center justify-center rounded box-content transition-[background-color] duration-200 hover:bg-[var(--highlight-weak)]"
				onClick={() => setShowError(false)}
			/>
			<b>{latestError}</b>
		</div>
	);
};

export default ErrorDisplay;
