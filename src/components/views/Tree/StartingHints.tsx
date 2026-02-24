import styled from "styled-components";
import {
	ContainerHorizontal,
	Filler,
	Hint,
} from "../../../styles/sharedStyles";

const StyledHint = styled(Hint)`
  padding: 0px 8px;
`;

const StartingHints = () => {
	return (
		<ContainerHorizontal>
			<StyledHint>
				AI daemons will leave comments on your writing here
			</StyledHint>
			<Filler style={{ minWidth: "73%" }} />
		</ContainerHorizontal>
	);
};

export default StartingHints;
