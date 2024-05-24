import React, { useEffect, useState } from 'react';
import { useAppSelector } from './hooks';
import { store } from './redux/store';
import { selectLatestError } from './redux/errorSlice';
import styled from 'styled-components';
import { ExitButtonSmall } from './styles/sharedStyles';

const ErrorContainer = styled.div`
  position: fixed;
  z-index: 50;
  color: var(--accent-color-red);
  background-color: var(--bg-color-light);
  bottom: 0;
  left: 0;
  border: 0.5px solid var(--line-color-dark);
  border-radius: 4px;
  padding: 10px 28px 10px 10px;
  margin: 4px;
`;

export function dispatchError(error: any) {
  store.dispatch({ type: 'error/addError', payload: error });
}

const ErrorDisplay: React.FC = () => {
  const latestError = useAppSelector(selectLatestError);
  const [showError, setShowError] = useState<boolean>(false);
  const latestErrorTime = useAppSelector(state => state.error.latestErrorTime);
  const maxTimeErrorVisible = 10; // seconds

  useEffect(() => {
    if (latestErrorTime) {
      const timeSinceLatestError = Date.now() - latestErrorTime;
      if (timeSinceLatestError < maxTimeErrorVisible * 1000) {
        setShowError(true);
        const timer = setTimeout(() => {
          setShowError(false);
        }, maxTimeErrorVisible * 1000 - timeSinceLatestError);

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
      {latestError}
    </ErrorContainer>
  );
};

export default ErrorDisplay;