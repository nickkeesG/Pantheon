import styled from 'styled-components';
import Settings from './settings/Settings';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { IconButtonMedium } from '../styles/sharedStyles';
import { useEffect, useState } from 'react';
import { SlArrowUp } from 'react-icons/sl';
import { navigateToParentSection } from '../redux/thunks';
import { selectSectionContentForExporting } from '../redux/ideaSlice';
// import { MdOutlineCollectionsBookmark } from "react-icons/md";

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
  background: var(--bg-color-light);
  padding: 4px 12px;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const TopBar = () => {
  const dispatch = useAppDispatch();
  const activeSectionId = useAppSelector(state => state.ui.activeSectionId);
  const activeSection = useAppSelector(state => state.section.sections[activeSectionId]);
  const ideaExports = useAppSelector(state => selectSectionContentForExporting(state, activeSectionId));
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
      <div />
      {/* <IconButtonMedium
        title="Collection view"
        // TODO Implement onClick, then make visible
      >
        <MdOutlineCollectionsBookmark />
      </IconButtonMedium> */}
      {activeSection.parentSectionId !== null && (
        <UpButton
          title="Back to previous tree"
          onClick={() => dispatch(navigateToParentSection())}
        />
      )}
      <ButtonContainer>
        <IconButtonMedium
          title="Copy context"
          onClick={copyContextToMarkdown}
        >
          {isCopied ? <FiCheckCircle /> : <FiCopy />}
        </IconButtonMedium>
        <Settings />
      </ButtonContainer>
    </StyledTopBar>
  )
};

export default TopBar;