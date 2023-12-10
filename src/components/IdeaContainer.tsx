import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Idea, switchBranch, selectCommentsForIdea, setCurrentIdea, selectChildrenOfIdea } from '../redux/textSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import CommentList from './CommentList';
import { IconButton } from '../styles/SharedStyles';
import { SlArrowLeft } from "react-icons/sl";
import { HiPlus } from "react-icons/hi2";

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  word-break: break-word;
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

const ArrowButton = styled(IconButton).attrs({
  as: SlArrowLeft
})`
  height: 24px;
  width: 16px;
  padding: 4px 2px;
  margin: 4px;
`;

const CenterPanel = styled.div`
  flex: 0 0 46%;
  display: flex;
  flex-direction: row;
`;

const StyledIdeaContainer = styled.div`
  position: relative;
  flex: 1;
  padding: 10px 28px 10px 10px;
  margin: 10px 0px;
  border: 0.5px solid var(--line-color-dark);
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
`;

const PlusButton = styled(IconButton).attrs({
  as: HiPlus
})`
  position: absolute;
  top: 4px;
  right: 4px;
  margin: 0px;
  padding: 4px;
`;

interface IdeaContainerProps {
  idea: Idea;
  baseCommentOffset: number;
  chatCommentOffset: number;
  setCommentOverflow: (isChatComment: boolean, ideaId: number, height: number) => void;
}

const IdeaContainer: React.FC<IdeaContainerProps> = ({ idea, baseCommentOffset, chatCommentOffset, setCommentOverflow }) => {
  const dispatch = useAppDispatch();
  const childIdeas = useAppSelector(state => selectChildrenOfIdea(state, idea.id));
  const hasBranches = childIdeas.length > 1;
  const baseComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "base"));
  const chatComments = useAppSelector(state => selectCommentsForIdea(state, idea.id, "chat"));
  const containerRef = useRef<HTMLDivElement>(null);
  const baseCommentPanelRef = useRef<HTMLDivElement>(null);
  const chatCommentPanelRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);

  const commentListHeightChanged = (isChat: boolean, newHeight: number, offset: number) => {
    // Get the height of the idea object
    const containerHeight = containerRef.current?.getBoundingClientRect().height || 0;
    // Calculate how far past the idea object the comments go
    const commentOverflow = (offset || 0) + newHeight - containerHeight;
    setCommentOverflow(isChat, idea.id, Math.max(0, commentOverflow));
  };

  const createNewBranch = () => {
    dispatch(setCurrentIdea(idea))
  }

  const switchBranches = (moveForward: boolean) => {
    dispatch(switchBranch({ parentIdea: idea, moveForward }))
  }

  const ideaContainerStyle = isHighlighted ? { borderColor: 'var(--line-color)', backgroundColor: 'var(--bg-color-light)' } : {};

  return (
    <Container
      ref={containerRef}
      onMouseEnter={() => setShowPlusButton(true)}
      onMouseLeave={() => setShowPlusButton(false)}
    >
      <SidePanel>
        <div
          ref={baseCommentPanelRef}
          onMouseEnter={() => setIsHighlighted(true)}
          onMouseLeave={() => setIsHighlighted(false)}>
          <CommentList
            offset={baseCommentOffset}
            comments={baseComments}
            onHeightChanged={(newHeight) => commentListHeightChanged(false, newHeight, baseCommentOffset)} />
        </div>
      </SidePanel>
      <CenterPanel>
        <ActionPanel>
          <ArrowButton
            onClick={() => switchBranches(false)}
            style={{ visibility: hasBranches ? 'visible' : 'hidden' }} />
        </ActionPanel>
        <StyledIdeaContainer style={ideaContainerStyle}>
          {idea.text}
          <PlusButton
            onClick={createNewBranch}
            style={{
              visibility: showPlusButton ? 'visible' : 'hidden',
              float: 'right'
            }}
          />
        </StyledIdeaContainer>
        <ActionPanel style={{ visibility: hasBranches ? 'visible' : 'hidden' }}>
          <ArrowButton
            onClick={() => switchBranches(true)}
            style={{
              visibility: hasBranches ? 'visible' : 'hidden',
              transform: 'rotate(180deg)'
            }}
          />
        </ActionPanel>
      </CenterPanel>
      <SidePanel>
        <div
          ref={chatCommentPanelRef}
          onMouseEnter={() => setIsHighlighted(true)}
          onMouseLeave={() => setIsHighlighted(false)}>
          <CommentList
            offset={chatCommentOffset}
            comments={chatComments}
            onHeightChanged={(newHeight) => commentListHeightChanged(true, newHeight, chatCommentOffset)} />
        </div>
      </SidePanel>
    </Container>
  );
};

export default IdeaContainer;