import type React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks";
import { createTree } from "../../../redux/thunks";
import { Button, ButtonHighlighted } from "../../../styles/sharedStyles";

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
		<div className="prose flex flex-col items-center justify-center max-w-[1024px] mx-auto my-16 items-center text-center gap-8">
			<h1 className="text-4xl font-light mb-8">Pantheon</h1>
			<p className="text-lg !text-[var(--text-color-secondary)]">
				Explore your ideas and create knowledge trees with powerful and
				customizable AI assistance
			</p>
			<div className="flex flex-col items-center gap-1">
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
			</div>
			<p className="!text-[var(--text-color-secondary)] mt-8">
				Pantheon is an experimental LLM interface exploring new ways to use AI
				to improve human thinking.
				<br />
				<b>OpenAI API key required.</b>
			</p>
			<a href="https://www.lesswrong.com/posts/JHsfMWtwxBGGTmb8A/pantheon-interface">
				{" "}
				Learn more about the project
			</a>
		</div>
	);
};

export default LandingView;
