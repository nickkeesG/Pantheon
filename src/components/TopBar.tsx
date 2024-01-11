import styled from 'styled-components';
import Settings from './settings/Settings';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';
import { goUpPage, selectCurrentPage, selectFullContext } from '../redux/textSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { IconButtonMedium } from '../styles/sharedStyles';
import { useEffect, useState } from 'react';
import { SlArrowUp } from 'react-icons/sl';

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

const UpButton = styled(IconButtonMedium).attrs({
  as: SlArrowUp
})`
  width: 39%;
  height: 100%;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border: 0px;
  border-left: 0.5px solid var(--line-color-dark);
  border-right: 0.5px solid var(--line-color-dark);
  border-radius: 0px;
`;

const TopBar = () => {
  const dispatch = useAppDispatch();
  const ideaExports = useAppSelector(selectFullContext);
  const [isCopied, setIsCopied] = useState(false);
  const currentPage = useAppSelector(selectCurrentPage);

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
      {currentPage.parentPageId !== null && (
        <UpButton
          title="Back to previous tree"
          onClick={() => dispatch(goUpPage())}
        />
      )}
      <IconButtonMedium
        title="Copy context"
        onClick={copyContextToMarkdown}
      >
        {isCopied ? <FiCheckCircle /> : <FiCopy />}
      </IconButtonMedium>
      <Settings />
    </StyledTopBar>
  )
};

export default TopBar;