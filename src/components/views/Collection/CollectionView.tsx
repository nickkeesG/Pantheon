import { useAppDispatch, useAppSelector } from "../../../hooks";
import { createTree } from "../../../redux/thunks";
import { selectTreesWithMostRecentEdit } from "../../../redux/treeSlice";
import { TextButton } from "../../../styles/sharedStyles";
import TreeListItem from "./TreeListItem";

function CollectionView() {
	const dispatch = useAppDispatch();
	const trees = useAppSelector((state) => selectTreesWithMostRecentEdit(state));

	const handleCreateTree = () => {
		const treeId = Date.now();
		dispatch(createTree(treeId));
	};

	return (
		<div className="flex flex-col w-full box-border items-center">
			<div className="flex flex-col w-full items-center py-10 px-4 mt-18">
				<div className="flex flex-col max-w-[1024px] w-full">
					<h1 className="text-4xl font-light text-center">Trees</h1>
					<TextButton style={{ alignSelf: "end" }} onClick={handleCreateTree}>
						+ New tree
					</TextButton>
					<ul className="w-full p-0 list-none border-t-[0.5px_solid_var(--line-color)]">
						{Object.values(trees).map((tree) => (
							<li key={tree.id}>
								<TreeListItem
									tree={tree}
									mostRecentEdit={tree.mostRecentEdit}
								/>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default CollectionView;
