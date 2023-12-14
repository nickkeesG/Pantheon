import styled from 'styled-components';
import Settings from './Settings';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';
import { selectFullContext } from '../redux/textSlice';
import { useAppSelector } from '../hooks';
import { IconButton } from '../styles/SharedStyles';
import { useEffect, useState } from 'react';

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
  padding: 4px 12px 4px 4px;
  z-index: 1000;
  border-bottom: 0.5px solid var(--line-color-dark);
`;

const TopBar = () => {
  const ideaExports = useAppSelector(selectFullContext);
  const [isCopied, setIsCopied] = useState(false);

  const copyContextToMarkdown = async () => {
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
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy context to clipboard', err);
    }
  }

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <StyledTopBar>
      <IconButton
        title="Copy context"
        onClick={copyContextToMarkdown}
        style={{
          width: '16px',
          height: '16px',
          padding: '6px',
          boxSizing: 'content-box',
          color: 'var(--main-text-color)'
        }}
      >
        {isCopied ? <FiCheckCircle /> : <FiCopy />}
      </IconButton>
      <Settings />
    </StyledTopBar>
  )
};

export default TopBar;