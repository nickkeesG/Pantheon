import styled from 'styled-components';
import InputBox from './InputBox';
import HistoryContainer from './HistoryContainer';
import TopBar from './TopBar';
import ErrorDisplay from '../errorHandler';

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
    </DisplayContainer>
  );
}

export default Display;