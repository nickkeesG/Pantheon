import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Idea } from '../../../redux/models';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import CommentList from './CommentList';
import { IconButtonLarge, TextButton } from '../../../styles/sharedStyles';
import { SlArrowLeft } from "react-icons/sl";
import { HiPlus } from "react-icons/hi2";
import IdeaText from './IdeaText';
import { selectCommentsForIdea } from '../../../redux/commentSlice';
import { createBranch } from '../../../redux/uiSlice';
import { navigateToChildSection, switchBranch } from '../../../redux/thunks';
import { selectIdeaBranches, selectSectionBranchRootIdeas } from '../../../redux/ideaSlice';
import { emergeAnimation } from '../../../styles/mixins';

// TODO Massively cleanup this file, it's way too big
// TODO Also restructure files into folders based on view

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  word-break: break-word;
  padding: 8px 0px;
`;

const SidePanel = styled.div`
  flex: 0 0 27%;
`;

const ActionPanel = styled.div`
  flex: 0 0 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ArrowButton = styled(IconButtonLarge).attrs({
  as: SlArrowLeft
})`
  height: 24px;
  width: 16px;
  padding: 4px 2px;
  margin: 4px;
`;

const SectionButton = styled(TextButton)`
  white-space: nowrap;
  margin: 0px 28px;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CenterPanel = styled.div`
  max-width: 46%;
  flex: 0 0 46%;
  display: flex;
  flex-direction: column;
  ${emergeAnimation};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledIdeaContainer = styled.div`
  position: relative;
  flex: 1;
  padding: 10px 28px 10px 10px;
  margin: 2px 0px;
  border: 0.5px solid var(--line-color-dark);
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
`;

const PlusButton = styled(IconButtonLarge).attrs({
  as: HiPlus
})`
  position: absolute;
  top: 6px;
  right: 6px;
  margin: 0px;
  padding: 2px;
`;

interface IdeaContainerProps {
  idea: Idea;
  leftCommentOffset: number;
  rightCommentOffset: number;
  setCommentOverflow: (isRightComment: boolean, ideaId: number, height: number) => void;
}

const IdeaContainer: React.FC<IdeaContainerProps> = ({ idea, leftCommentOffset, rightCommentOffset, setCommentOverflow }) => {
  const dispatch = useAppDispatch();
  const branchingIdeas = useAppSelector(state => selectIdeaBranches(state, idea.id));
  const hasBranches = branchingIdeas.length > 0;
  const branchingSectionsRootIdeas = useAppSelector(state => selectSectionBranchRootIdeas(state, idea.id));
  const leftComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "left"));
  const rightComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "right"));
  const containerRef = useRef<HTMLDivElement>(null);
  const leftCommentPanelRef = useRef<HTMLDivElement>(null);
  const rightCommentPanelRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);

  const commentListHeightChanged = (isRight: boolean, newHeight: number, offset: number) => {
    // Get the height of the idea object
    const containerHeight = containerRef.current?.getBoundingClientRect().height || 0;
    // Calculate how far past the idea object the comments go
    const commentOverflow = (offset || 0) + newHeight - containerHeight;
    setCommentOverflow(isRight, idea.id, Math.max(0, commentOverflow));
  };

  const newBranch = () => {
    dispatch(createBranch(idea.id))
  }

  const switchBranches = (moveForward: boolean) => {
    dispatch(switchBranch(idea, moveForward))
  }

  const ideaContainerStyle = isHighlighted ? { borderColor: 'var(--line-color)', backgroundColor: 'var(--bg-color-secondary)' } : {};
  if (!idea.isUser) { ideaContainerStyle.borderColor = 'transparent' }

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setShowPlusButton(true)}
      onMouseLeave={() => setShowPlusButton(false)}
    >
      <SidePanel>
        <div
          ref={leftCommentPanelRef}
          onMouseEnter={() => setIsHighlighted(true)}
          onMouseLeave={() => setIsHighlighted(false)}>
          <CommentList
            offset={leftCommentOffset}
            comments={leftComments}
            onHeightChanged={(newHeight) => commentListHeightChanged(false, newHeight, leftCommentOffset)} />
        </div>
      </SidePanel>
      <CenterPanel>
        <Row>
          <ActionPanel>
            <ArrowButton
              title='Previous branch'
              onClick={() => switchBranches(false)}
              style={{ visibility: hasBranches ? 'visible' : 'hidden' }} />
          </ActionPanel>
          <StyledIdeaContainer style={ideaContainerStyle}>
            <IdeaText idea={idea} />
            <PlusButton
              title='New branch'
              onClick={newBranch}
              style={{
                visibility: showPlusButton ? 'visible' : 'hidden',
                float: 'right'
              }}
            />
          </StyledIdeaContainer>
          <ActionPanel style={{ visibility: hasBranches ? 'visible' : 'hidden' }}>
            <ArrowButton
              title='Next branch'
              onClick={() => switchBranches(true)}
              style={{
                visibility: hasBranches ? 'visible' : 'hidden',
                transform: 'rotate(180deg)'
              }}
            />
          </ActionPanel>
        </Row>
        {branchingSectionsRootIdeas.map((idea, index) => (
          <Row key={index}>
            <SectionButton
              title="Go to child section"
              onClick={() => dispatch(navigateToChildSection(idea))}
            >
              Child section: {idea.text}
            </SectionButton>
          </Row>
        ))}
      </CenterPanel>
      <SidePanel>
        <div
          ref={rightCommentPanelRef}
          onMouseEnter={() => setIsHighlighted(true)}
          onMouseLeave={() => setIsHighlighted(false)}>
          <CommentList
            offset={rightCommentOffset}
            comments={rightComments}
            onHeightChanged={(newHeight) => commentListHeightChanged(true, newHeight, rightCommentOffset)} />
        </div>
      </SidePanel>
    </Container>
  );
};

export default IdeaContainer;