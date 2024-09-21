import styled from 'styled-components';
import { TextButton } from '../../styles/sharedStyles';
import { Link } from 'react-router-dom';

const StyledTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2.6em;
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

const PantheonButton = styled(TextButton)`
  font-weight: 300;
  font-size: 1.2em;
  padding: 0 4px;

  &:hover:not(:disabled) {
    background-color: transparent;
    color: var(--text-color);
  }
`;


const TopBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <StyledTopBar>
      <Link to="/">
        <PantheonButton>
          Pantheon
        </PantheonButton>
      </Link>
      {children}
    </StyledTopBar>
  )
};

export default TopBar;