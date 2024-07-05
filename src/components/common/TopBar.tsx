import styled from 'styled-components';
import WelcomeInfoButton from '../WelcomeInfoButton';

const StyledTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 4px;
  background: var(--bg-color-secondary);
  padding: 4px 12px;
  z-index: 50;
  border-top: 0.5px solid var(--line-color);
  border-bottom: 0.5px solid var(--line-color-strong);
`;

const TopBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <StyledTopBar>
      {children}
      <WelcomeInfoButton />
    </StyledTopBar>
  )
};

export default TopBar;