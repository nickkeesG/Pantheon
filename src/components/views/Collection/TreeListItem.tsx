import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectIdeasInTree } from "../../../redux/ideaSlice";
import type { Tree } from "../../../redux/models";
import { deleteTreeAndContent } from "../../../redux/thunks";
import { renameTree } from "../../../redux/treeSlice";
import { highlightOnHover } from "../../../styles/mixins";
import {
	Button,
	ButtonDangerous,
	ContainerHorizontal,
	ContainerVertical,
	IconButtonMedium,
	TextInput,
} from "../../../styles/sharedStyles";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "../../ui/Dialog";

const TreeListItemContainer = styled(ContainerHorizontal)`
  width: 100%;
  margin: 0px;
  border: none;
  border-bottom: 0.5px solid var(--line-color);
  border-radius: 0px;
  color: var(--text-color-secondary);
  text-align: start;
  ${highlightOnHover};
  padding: 8px 16px;
`;

const ButtonContainer = styled(ContainerHorizontal)`
  flex-grow: 0;
  width: fit-content;
  min-width: 64px;
  padding-left: 8px;
`;

const Header = styled.div`
  color: var(--text-color);
  min-height: 33px;
  font-size: 1.1em;
  box-sizing: border-box;
  align-items: center;
  display: flex;
`;

const Description = styled.div`
  margin-top: 8px;
  font-size: 0.9em;
`;

const TreeListItem: React.FC<{ tree: Tree; mostRecentEdit: Date }> = ({
	tree,
	mostRecentEdit,
}) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const ideas = useAppSelector((state) => selectIdeasInTree(state, tree.id));
	const [hovering, setHovering] = useState(false); // TODO Would be nice to have this as a custom hook
	const [editing, setEditing] = useState(false);
	const treeListItemRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			setEditing(false);
		}
	};

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (
			treeListItemRef.current &&
			!treeListItemRef.current.contains(event.target as Node)
		) {
			setEditing(false);
		}
	}, []);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleClickOutside]);

	const handleTreeClick = () => {
		navigate(`/tree/${tree.id}`);
	};

	const handleDelete = () => {
		dispatch(deleteTreeAndContent(tree.id));
	};

	return (
		<TreeListItemContainer
			ref={treeListItemRef}
			onClick={handleTreeClick}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			<ContainerVertical>
				{editing ? (
					<TextInput
						onClick={(evt) => evt.stopPropagation()}
						value={tree.name || ""}
						onChange={(e) => {
							dispatch(
								renameTree({ treeId: tree.id, newName: e.target.value }),
							);
						}}
						onKeyDown={handleKeyDown}
						autoFocus
					/>
				) : (
					<Header>{tree.name || "New tree"}</Header>
				)}
				<Description>
					Sections: {tree.sectionIds.length} | Ideas: {ideas.length}
					{mostRecentEdit.getFullYear() > 2020 && ( // The first generated tree has id / timestamp 0
						<>
							{" "}
							| Last edit{" "}
							{formatDistanceToNow(mostRecentEdit, { addSuffix: true })}
						</>
					)}
				</Description>
			</ContainerVertical>
			<ButtonContainer onClick={(evt) => evt.stopPropagation()}>
				{hovering && (
					<IconButtonMedium onClick={() => setEditing(true)}>
						<FaRegEdit />
					</IconButtonMedium>
				)}
				<Dialog>
					<DialogTrigger asChild>
						<IconButtonMedium
							style={hovering ? undefined : { display: "none" }}
						>
							<MdDeleteOutline />
						</IconButtonMedium>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle className="sr-only">Confirm delete</DialogTitle>
						<DialogDescription className="mb-5">
							Are you sure you want to delete this tree? This cannot be undone.
						</DialogDescription>
						<div className="flex justify-around">
							<DialogClose asChild>
								<ButtonDangerous onClick={handleDelete}>
									Confirm
								</ButtonDangerous>
							</DialogClose>
							<DialogClose asChild>
								<Button>Cancel</Button>
							</DialogClose>
						</div>
					</DialogContent>
				</Dialog>
			</ButtonContainer>
		</TreeListItemContainer>
	);
};

export default TreeListItem;
