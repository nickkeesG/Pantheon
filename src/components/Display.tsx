import styled from 'styled-components';
import InputBox from './InputBox';
import HistoryContainer from './HistoryContainer';
import TopBar from './TopBar';
import ErrorDisplay from '../errorHandler';
import WelcomeMessage from './WelcomeMessage';

const DisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function Display() {

  return (
    <DisplayContainer>
      <TopBar />
      <HistoryContainer />
      <InputBox />
      <ErrorDisplay />
      <WelcomeMessage />
    </DisplayContainer>
  );
}

export default Display;