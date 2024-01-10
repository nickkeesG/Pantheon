import React, { useEffect, useState } from 'react';
import { useAppSelector } from './hooks';
import { store } from './redux/store';
import { selectLatestError, selectNumberOfErrors} from './redux/errorSlice';
import styled from 'styled-components';
import { debug } from 'console';

const ErrorContainer = styled.div`
  color: red;
  position: fixed;
  bottom: 0;
  left: 0;
`;

export function dispatchError(error: any) {
  store.dispatch({ type: 'error/addError', payload: error });
}

const ErrorDisplay: React.FC = () => {
  const latestError = useAppSelector(selectLatestError);
  const numberOfErrors = useAppSelector(selectNumberOfErrors);
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    if (latestError) {
      console.error(latestError);
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 10000);
  
      return () => clearTimeout(timer);
    }
  }, [latestError, numberOfErrors]);

  if (!showError) {
    return null;
  }

  return (
    <ErrorContainer>
      {latestError}
    </ErrorContainer>
  );
};

export default ErrorDisplay;