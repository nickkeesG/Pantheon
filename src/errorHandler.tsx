import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "./hooks";
import { selectLatestError } from "./redux/errorSlice";
import { store } from "./redux/store";
import { ExitButtonSmall } from "./styles/sharedStyles";

const ErrorContainer = styled.div`
  position: fixed;
  z-index: 50;
  color: var(--accent-color-red);
  background-color: var(--bg-color-secondary);
  bottom: 16px;
  left: 16px;
  border: 0.5px solid var(--accent-color-red);
  border-radius: 4px;
  padding: 10px 28px 10px 10px;
  margin: 4px;
`;

export function dispatchError(error: any) {
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
		<ErrorContainer>
			<ExitButtonSmall onClick={() => setShowError(false)} />
			<b>{latestError}</b>
		</ErrorContainer>
	);
};

export default ErrorDisplay;
