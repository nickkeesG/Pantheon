import styled from 'styled-components';
import InputBox from './InputBox';
import HistoryContainer from './HistoryContainer';
import Settings from './Settings';

const DisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function Display() {

  return (
    <DisplayContainer>
      <Settings />
      <HistoryContainer />
      <InputBox />
    </DisplayContainer>
  );
}

export default Display;