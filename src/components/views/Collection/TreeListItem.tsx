import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectIdeasInTree } from "../../../redux/ideaSlice";
import type { Tree } from "../../../redux/models";
import { deleteTreeAndContent } from "../../../redux/thunks";
import { renameTree } from "../../../redux/treeSlice";
import {
	Button,
	ButtonDangerous,
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
		// biome-ignore lint/a11y/useSemanticElements: complex list item layout with nested interactive elements
		<div
			ref={treeListItemRef}
			role="button"
			tabIndex={0}
			onClick={handleTreeClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") handleTreeClick();
			}}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
			className="flex flex-row w-full box-border m-0 border-none border-b border-b-[0.5px] border-b-[var(--line-color)] rounded-none text-[var(--text-color-secondary)] text-start px-4 py-2 transition-[background-color,border-color,color,opacity,transform] duration-200 hover:bg-[var(--highlight-weak)] cursor-pointer"
		>
			<div className="flex flex-col w-full box-border">
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
					<div className="text-[var(--text-color)] min-h-[33px] text-[1.1em] box-border items-center flex">
						{tree.name || "New tree"}
					</div>
				)}
				<div className="mt-2 text-[0.9em]">
					Sections: {tree.sectionIds.length} | Ideas: {ideas.length}
					{mostRecentEdit.getFullYear() > 2020 && ( // The first generated tree has id / timestamp 0
						<>
							{" "}
							| Last edit{" "}
							{formatDistanceToNow(mostRecentEdit, { addSuffix: true })}
						</>
					)}
				</div>
			</div>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only, no interactive behavior */}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation only */}
			<div
				className="flex flex-row box-border grow-0 w-fit min-w-16 pl-2"
				onClick={(evt) => evt.stopPropagation()}
			>
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
			</div>
		</div>
	);
};

export default TreeListItem;
