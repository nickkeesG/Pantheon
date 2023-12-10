import styled from "styled-components"
import { Idea, changeBranch } from "../redux/textSlice";
import { TextButton } from "../styles/SharedStyles";
import { useAppDispatch } from "../hooks";

const StyledChangeBranchPopup = styled.div`
  min-width: 100px;
  max-width: 300px;
  z-index: 20;
  position: absolute;
  top: 20px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: var(--bg-color-dark-transparent);
  color: var(--text-color);
  font-family: monospace;
  font-size: 8px;
`;

const Header = styled.h3`
  width: 100%;
`;

const ChangeBranchPopup = ({ ideas }: { ideas: Idea[] }) => {
  const dispatch = useAppDispatch();

  const switchBranches = (idea: Idea) => {
    dispatch(changeBranch(idea));
  }

  return (
    <StyledChangeBranchPopup>
      <Header>Switch to branch</Header>
      {ideas.map(idea => (
        <TextButton
          key={idea.id}
          onClick={() => switchBranches(idea)}>
          {idea.text}
        </TextButton>
      ))}
    </StyledChangeBranchPopup>
  )
}

export default ChangeBranchPopup;