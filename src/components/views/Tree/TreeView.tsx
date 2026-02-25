import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorDisplay from "../../../errorHandler";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { openTree } from "../../../redux/thunks";
import { ContainerVertical } from "../../../styles/sharedStyles";
import { Dialog, DialogContent } from "../../ui/Dialog";
import { WelcomeInfoContent } from "../../WelcomeInfoButton";
import CompletionsContainer from "./CompletionsContainer";
import HistoryContainer from "./HistoryContainer";
import InputArea from "./InputArea";
import TreeActionBar from "./TreeActionBar";

const shouldShowWelcome = !localStorage.getItem("hasSeenWelcomeMessage");

const TreeView = () => {
	const { treeId } = useParams();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const trees = useAppSelector((state) => state.tree.trees);
	const mostRecentTreeId = useAppSelector((state) => state.ui.activeTreeId);
	const [treeFound, setTreeFound] = useState(false);

	useEffect(() => {
		const requestedTreeExists = treeId && trees[parseInt(treeId, 10)];
		const shouldOpenMostRecentTree = !treeId && trees[mostRecentTreeId];
		if (requestedTreeExists) {
			dispatch(openTree(parseInt(treeId, 10)));
			setTreeFound(true);
		} else if (shouldOpenMostRecentTree) {
			dispatch(openTree(mostRecentTreeId));
			setTreeFound(true);
		} else {
			navigate("/collection");
			setTreeFound(false);
		}
	}, [treeId, dispatch, navigate, trees, mostRecentTreeId]);

	return (
		<ContainerVertical>
			{treeFound && (
				<>
					<TreeActionBar />
					<HistoryContainer />
					<InputArea />
					<CompletionsContainer />
					<ErrorDisplay />
				</>
			)}
			<Dialog defaultOpen={shouldShowWelcome}>
				<DialogContent>
					<WelcomeInfoContent />
				</DialogContent>
			</Dialog>
		</ContainerVertical>
	);
};

export default TreeView;
