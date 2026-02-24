import type React from "react";
import styled from "styled-components";
import { Button, ModalBox } from "../../styles/sharedStyles";
import { useModal } from "../ModalContext";

const Content = styled.div`
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

const InfoModal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { removeModal } = useModal();

	return (
		<ModalBox>
			<Content>{children}</Content>
			<ButtonGroup>
				<Button onClick={removeModal} style={{ minWidth: "60px" }}>
					Close
				</Button>
			</ButtonGroup>
		</ModalBox>
	);
};

export default InfoModal;
