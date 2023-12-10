import styled from 'styled-components';
import Settings from './Settings';
import { FiCopy } from 'react-icons/fi';
import { selectFullContext } from '../redux/textSlice';
import { useAppSelector } from '../hooks';

const StyledTopBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--bg-color-lighter);
  padding: 18px 0;
  z-index: 1000; // ensure it's above other elements
`;

const CopyButton = styled(FiCopy)`
  position: absolute;
  top: 0px;
  right: 24px;
  padding: 12px;
  cursor: pointer;
  z-index: 50;
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