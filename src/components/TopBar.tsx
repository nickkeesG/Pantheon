import styled from 'styled-components';
import Settings from './Settings';
import { FiCopy } from 'react-icons/fi';
import { selectFullContext } from '../redux/textSlice';
import { useAppSelector } from '../hooks';
import { IconButton } from '../styles/SharedStyles';

const StyledTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 4px;
  background: var(--bg-color-light);
  padding: 4px;
  z-index: 1000;
  border-bottom: 0.5px solid var(--line-color-dark);
`;

const CopyButton = styled(IconButton).attrs({
  as: FiCopy
})`
  width: 16px;
  height: 16px;
  padding: 6px;
  display: flex;
`;

const TopBar = () => {
  const ideaExports = useAppSelector(selectFullContext);

  const copyContextToMarkdown =  async() => {
    let context = '# Pantheon Context\n';
    for (let i = 0; i < ideaExports.length; i++) {
      const ideaExport = ideaExports[i];
      if (ideaExport.incoming) {
        context += `\n---`;
        context += `\n- (${ideaExport.text})`;
      }
      else {
        context += `\n- ${ideaExport.text}`;
        if (ideaExport.outgoing) {
          context += ' ->';
        }
      }
    }
    try {
      await navigator.clipboard.writeText(context);
      console.log('Context copied to clipboard');
    } catch (err) {
      console.error('Failed to copy context to clipboard', err);
    }
  }

  return (
    <StyledTopBar>
      <CopyButton title="Copy Context" onClick={copyContextToMarkdown}/>
      <Settings />
    </StyledTopBar>
  )
};

export default TopBar;