import styled from 'styled-components';
import Settings from './Settings';

const TopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--bg-color-lighter);
  padding: 18px 0;
  z-index: 1000; // ensure it's above other elements
`;

const HistoryContainer = () => {

  return (
    <TopBar>
      <Settings />
    </TopBar>
  )
};

export default HistoryContainer;