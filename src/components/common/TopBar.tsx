import styled from 'styled-components';

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
  z-index: 1000;
  border-bottom: 0.5px solid var(--line-color-dark);
`;

const TopBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <StyledTopBar>
      {children}
    </StyledTopBar>
  )
};

export default TopBar;