import type React from "react";
import { useEffect, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { SlArrowLeft } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectCommentsForIdea } from "../../../redux/commentSlice";
import {
	selectIdeaBranches,
	selectSectionBranchRootIdeas,
} from "../../../redux/ideaSlice";
import { type Idea, IdeaType } from "../../../redux/models";
import { navigateToChildSection, switchBranch } from "../../../redux/thunks";
import { createBranch } from "../../../redux/uiSlice";
import { getHighlightsArray } from "../../../styles/uiUtils";
import TextWithHighlights from "../../common/TextWithHighlights";
import CommentList from "./CommentList";

// TODO Massively cleanup this file, it's way too big

const iconBtnBase =
	"cursor-pointer font-inherit bg-transparent text-[var(--text-color-secondary)] border-none rounded inline-flex items-center justify-center box-content [&>svg]:w-full [&>svg]:h-full transition-[background-color,border-color,color,opacity,transform] duration-200 hover:not-disabled:bg-[var(--highlight-weak)] active:not-disabled:opacity-70";

interface IdeaContainerProps {
	idea: Idea;
	leftCommentOffset: number;
	rightCommentOffset: number;
	setCommentOverflow: (
		isRightComment: boolean,
		ideaId: number,
		height: number,
	) => void;
}

const IdeaContainer: React.FC<IdeaContainerProps> = ({
	idea,
	leftCommentOffset,
	rightCommentOffset,
	setCommentOverflow,
}) => {
	const dispatch = useAppDispatch();
	const branchingIdeas = useAppSelector((state) =>
		selectIdeaBranches(state, idea.id),
	);
	const hasBranches = branchingIdeas.length > 0;
	const branchingSectionsRootIdeas = useAppSelector((state) =>
		selectSectionBranchRootIdeas(state, idea.id),
	);
	const leftComments = useAppSelector((state) =>
		selectCommentsForIdea(state, idea.id, "left"),
	);
	const rightComments = useAppSelector((state) =>
		selectCommentsForIdea(state, idea.id, "right"),
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isHighlighted, setIsHighlighted] = useState(false);
	const [showPlusButton, setShowPlusButton] = useState(false);
	const [highlights] = useState<[number, number][]>(getHighlightsArray(idea));
	const daemonGeneratingCommentForIdea = useAppSelector(
		(state) => state.ui.incomingComment,
	);
	const [daemonCommentingLeft, setDaemonCommentingLeft] = useState("");
	const [daemonCommentingRight, setDaemonCommentingRight] = useState("");

	useEffect(() => {
		if (daemonGeneratingCommentForIdea?.ideaId === idea.id) {
			if (daemonGeneratingCommentForIdea.isRight) {
				setDaemonCommentingRight(daemonGeneratingCommentForIdea.daemonName);
			} else {
				setDaemonCommentingLeft(daemonGeneratingCommentForIdea.daemonName);
			}
		} else {
			setDaemonCommentingLeft("");
			setDaemonCommentingRight("");
		}
	}, [daemonGeneratingCommentForIdea, idea.id]);

	const commentListHeightChanged = (
		isRight: boolean,
		newHeight: number,
		offset: number,
	) => {
		// Get the height of the idea object
		const containerHeight =
			containerRef.current?.getBoundingClientRect().height || 0;
		// Calculate how far past the idea object the comments go
		const commentOverflow = (offset || 0) + newHeight - containerHeight;
		setCommentOverflow(isRight, idea.id, Math.max(0, commentOverflow));
	};

	const newBranch = () => {
		dispatch(createBranch(idea.id));
	};

	const switchBranches = (moveForward: boolean) => {
		dispatch(switchBranch(idea, moveForward));
	};

	const ideaContainerStyle: React.CSSProperties = isHighlighted
		? {
				borderColor: "var(--line-color)",
				backgroundColor: "var(--bg-color-secondary)",
			}
		: {};
	if (!(idea.type === IdeaType.User)) {
		ideaContainerStyle.borderColor = "transparent";
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover highlight only, not interactive
		<div
			ref={containerRef}
			className="flex relative w-full break-words py-2"
			onMouseEnter={() => setShowPlusButton(true)}
			onMouseLeave={() => setShowPlusButton(false)}
		>
			<CommentList
				offset={leftCommentOffset}
				comments={leftComments}
				onHeightChanged={(newHeight) =>
					commentListHeightChanged(false, newHeight, leftCommentOffset)
				}
				onHoverChange={setIsHighlighted}
				daemonCommenting={daemonCommentingLeft}
			/>
			<div className="max-w-[46%] flex-[0_0_46%] flex flex-col animate-emerge">
				<div className="flex flex-row">
					<div className="flex-[0_0_28px] flex flex-col items-center justify-center">
						<SlArrowLeft
							title="Previous branch"
							onClick={() => switchBranches(false)}
							style={{ visibility: hasBranches ? "visible" : "hidden" }}
							className={`${iconBtnBase} h-6 w-4 p-[4px_2px] m-1`}
						/>
					</div>
					<div
						className="relative flex-1 p-[10px_28px_10px_10px] my-0.5 border-[0.5px] border-[var(--line-color-strong)] rounded transition-[background-color,border-color] duration-300"
						style={{
							...ideaContainerStyle,
							marginLeft:
								idea.type === IdeaType.ResponseFromAi ? "20px" : undefined, // Responses to instructions are indented
						}}
					>
						<TextWithHighlights text={idea.text} highlights={highlights} />
						<HiPlus
							title="New branch"
							onClick={newBranch}
							className={`${iconBtnBase} w-5 h-5 p-0.5 absolute top-1.5 right-1.5 m-0`}
							style={{
								visibility: showPlusButton ? "visible" : "hidden",
								float: "right",
							}}
						/>
					</div>
					<div
						className="flex-[0_0_28px] flex flex-col items-center justify-center"
						style={{ visibility: hasBranches ? "visible" : "hidden" }}
					>
						<SlArrowLeft
							title="Next branch"
							onClick={() => switchBranches(true)}
							style={{
								visibility: hasBranches ? "visible" : "hidden",
								transform: "rotate(180deg)",
							}}
							className={`${iconBtnBase} h-6 w-4 p-[4px_2px] m-1`}
						/>
					</div>
				</div>
				{branchingSectionsRootIdeas.map((idea) => (
					<div className="flex flex-row" key={idea.id}>
						<button
							type="button"
							title="Go to child section"
							onClick={() => dispatch(navigateToChildSection(idea))}
							className="cursor-pointer font-inherit text-[inherit] bg-transparent text-[var(--text-color-secondary)] border-none rounded-lg px-2 py-1 m-1 transition-[background-color,border-color,color,opacity,transform] duration-200 hover:not-disabled:bg-[var(--highlight-weak)] active:not-disabled:opacity-70 whitespace-nowrap mx-7 text-[0.75rem] overflow-hidden text-ellipsis"
						>
							Child section: {idea.text}
						</button>
					</div>
				))}
			</div>
			<CommentList
				offset={rightCommentOffset}
				comments={rightComments}
				onHeightChanged={(newHeight) =>
					commentListHeightChanged(true, newHeight, rightCommentOffset)
				}
				onHoverChange={setIsHighlighted}
				daemonCommenting={daemonCommentingRight}
			/>
		</div>
	);
};

export default IdeaContainer;
