import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { TextState } from '../redux/contentSlice';
import IdeaContainer from './IdeaContainer';

const StyledHistoryContainer = styled.div`
  padding: 10px 0px;
`;

const HistoryContainer = () => {
  const ideas = useSelector((state: TextState) => state.ideas);
  return (
    <StyledHistoryContainer>
      {/* TODO Add some cute animation when adding blocks */}
      {ideas.map((idea, index) => (
        <IdeaContainer key={index} idea={idea} />
      ))}
    </StyledHistoryContainer>
  )
};

export default HistoryContainer;