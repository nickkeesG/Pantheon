import type React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch } from "../../../hooks";
import { createTree } from "../../../redux/thunks";
import {
	Button,
	ButtonHighlighted,
	ContainerVertical,
	Filler,
	TextButton,
} from "../../../styles/sharedStyles";
import TopBar from "../../common/TopBar";

const LandingContainer = styled(ContainerVertical)`
  align-items: center;
  justify-content: center;
  padding: 80px 16px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LandingView: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleCreateTree = () => {
		const treeId = Date.now();
		dispatch(createTree(treeId));
		navigate(`/tree/${treeId}`);
	};

	const handleViewCollection = () => {
		navigate("/collection");
	};

	return (
		<LandingContainer>
			<TopBar>
				<Filler />
				<TextButton onClick={handleCreateTree} style={{ margin: 0 }}>
					Start writing
				</TextButton>
			</TopBar>
			<ContainerVertical
				style={{ maxWidth: "1024px", margin: "0 auto", alignItems: "center" }}
			>
				<Title>Pantheon</Title>
				<Subtitle>
					Explore your ideas and create knowledge trees with powerful and
					customizable AI assistance
				</Subtitle>
				<ButtonContainer>
					<ButtonHighlighted
						onClick={handleCreateTree}
						style={{ fontSize: "1.6rem" }}
					>
						Start writing
					</ButtonHighlighted>
					or
					<Button onClick={handleViewCollection} style={{ fontSize: "1.2rem" }}>
						View my trees
					</Button>
				</ButtonContainer>
				<p style={{ marginTop: "80px" }}>
					Pantheon is an experimental LLM interface exploring new ways to use AI
					to improve human thinking. OpenAI API key required.
				</p>
				<a href="https://www.lesswrong.com/posts/JHsfMWtwxBGGTmb8A/pantheon-interface">
					{" "}
					Learn more about the project
				</a>
			</ContainerVertical>
		</LandingContainer>
	);
};

export default LandingView;
