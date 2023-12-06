import React from 'react';
import styled from 'styled-components';
import { Idea, TextState, selectCommentsByIdeaId } from '../redux/textSlice';
import CommentContainer from './CommentContainer';
import { useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const SidePanel = styled.div`
  flex: 1 1 20%;
  min-width: 20%;
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 60%;
  min-width: 60%;
`;

const StyledIdeaContainer = styled.div`
  padding: 10px;
  margin: 10px 0px;
  border: 0.1px solid var(--line-color-dark);
  border-radius: 4px;
`;

const IdeaContainer: React.FC<{ idea: Idea }> = ({ idea }) => {
  const comments = useSelector((state: TextState) => selectCommentsByIdeaId(state, idea.id));

  return (
    <Container>
      <SidePanel />
      <CenterPanel>
        <StyledIdeaContainer>
          {idea.text}
        </StyledIdeaContainer>
      </CenterPanel>
      <SidePanel>
        {comments.length > 0 && comments.map((comment) => (
          <CommentContainer key={comment.id} comment={comment} />
        ))}
      </SidePanel>
    </Container>
  );
};

export default IdeaContainer;