import styled from 'styled-components';
import InputBox from './InputBox';
import HistoryContainer from './HistoryContainer';
import Settings from './Settings';

const DisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--bg-color-lighter);
  padding: 18px 0;
  z-index: 1000; // ensure it's above other elements
`;

function Display() {

  return (
    <DisplayContainer>
      <TopBar>
        <Settings />
      </TopBar>
      <HistoryContainer />
      <InputBox />
    </DisplayContainer>
  );
}

export default Display;