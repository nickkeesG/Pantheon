import styled from 'styled-components';
import Settings from './settings/Settings';
import Info from './Info';
import { FiCheckCircle, FiCopy } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { IconButtonMedium } from '../styles/sharedStyles';
import { useEffect, useState } from 'react';
import { SlArrowUp } from 'react-icons/sl';
import { navigateToParentSection } from '../redux/thunks';
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Link } from 'react-router-dom';
import { setCreatingSection } from '../redux/uiSlice';
import { selectSectionContentAsMarkdown } from '../redux/sectionSlice';

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
  const creatingSection = useAppSelector(state => state.ui.creatingSection);
  const markdown = useAppSelector(state => selectSectionContentAsMarkdown(state, activeSectionId));
  const [isCopied, setIsCopied] = useState(false);

  const copyContextToMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
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

  const upButtonClicked = () => {
    if (creatingSection) {
      dispatch(setCreatingSection(false));
    } else if (activeSection.parentSectionId !== null) {
      dispatch(navigateToParentSection());
    } else {
      console.error("Up button pressed but no upper section to return to")
    }
  }

  return (
    <StyledTopBar>
      <div>
        <Link to="/collection" >
          <IconButtonMedium title="Collection view">
            <MdOutlineCollectionsBookmark />
          </IconButtonMedium>
        </Link>
      </div>
      {(creatingSection || activeSection.parentSectionId !== null) && (
        <UpButton
          title="Back to previous tree"
          onClick={upButtonClicked}
        />
      )}
      
      <ButtonContainer>
        <IconButtonMedium
          title="Copy context"
          onClick={copyContextToMarkdown}
          disabled={creatingSection || activeSection.ideaIds.length === 0}
        >
          {isCopied ? <FiCheckCircle /> : <FiCopy />}
        </IconButtonMedium>
        <Info />
        <Settings />
      </ButtonContainer>
    </StyledTopBar>
  )
};

export default TopBar;