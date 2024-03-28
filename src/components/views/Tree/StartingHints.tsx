import styled from "styled-components";
import { ContainerHorizontal, Filler, Hint } from "../../../styles/sharedStyles"


const StyledHint = styled(Hint)`
  padding: 0px 8px;
`;

const StartingHints = () => {

  return (
    <ContainerHorizontal>
      <StyledHint>Base model generated comments will appear here</StyledHint>
      <Filler style={{ minWidth: '46%' }} />
      <StyledHint>Chat model generated comments will appear here</StyledHint>
    </ContainerHorizontal>
  )
}

export default StartingHints;