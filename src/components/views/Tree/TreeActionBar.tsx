import { useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import { SlArrowUp } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { selectSectionContentAsMarkdown } from "../../../redux/sectionSlice";
import { navigateToParentSection } from "../../../redux/thunks";
import { setCreatingSection } from "../../../redux/uiSlice";
import { IconButtonMedium } from "../../../styles/sharedStyles";
import { useActionBar } from "../../common/ActionBarContext";

function TreeActionBar() {
	const { setActionBar } = useActionBar();
	const dispatch = useAppDispatch();
	const activeTreeId = useAppSelector((state) => state.ui.activeTreeId);
	const treeName = useAppSelector(
		(state) => state.tree.trees[activeTreeId]?.name,
	);
	const activeSectionId = useAppSelector((state) => state.ui.activeSectionId);
	const activeSection = useAppSelector(
		(state) => state.section.sections[activeSectionId],
	);
	const creatingSection = useAppSelector((state) => state.ui.creatingSection);
	const markdown = useAppSelector((state) =>
		selectSectionContentAsMarkdown(state, activeSectionId),
	);
	const [isCopied, setIsCopied] = useState(false);

	const copyContextToMarkdown = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(markdown);
			setIsCopied(true);
		} catch (err) {
			console.error("Failed to copy context to clipboard", err);
		}
	}, [markdown]);

	useEffect(() => {
		if (isCopied) {
			const timer = setTimeout(() => {
				setIsCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isCopied]);

	const handleUp = useCallback(() => {
		if (creatingSection) {
			dispatch(setCreatingSection(false));
		} else if (activeSection.parentSectionId !== null) {
			dispatch(navigateToParentSection());
		}
	}, [activeSection.parentSectionId, creatingSection, dispatch]);

	const showUp = creatingSection || activeSection.parentSectionId !== null;

	useEffect(() => {
		setActionBar(
			<>
				<div className="relative w-full flex flex-row items-center bg-[var(--bg-color)] px-4 py-1 border-b border-[var(--line-color-strong)]">
					<span className="text-sm text-[var(--text-color-secondary)] truncate">
						{treeName || "New tree"}
					</span>
					{showUp && (
						<button
							type="button"
							title="Back to parent section"
							onClick={handleUp}
							className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[39%] bg-transparent border-0 cursor-pointer text-[var(--text-color)] flex items-center justify-center transition-colors duration-200 hover:bg-[var(--highlight-weak)] border-r border-l border-l-[var(--line-color-strong)] border-r-[var(--line-color-strong)]"
						>
							<SlArrowUp />
						</button>
					)}
					<div className="ml-auto">
						<IconButtonMedium
							title="Copy context"
							onClick={copyContextToMarkdown}
							disabled={creatingSection || activeSection.ideaIds.length === 0}
						>
							{isCopied ? <FiCheckCircle /> : <FiCopy />}
						</IconButtonMedium>
					</div>
				</div>
				<div className="hidden max-md:block px-3 py-2 text-xs bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-900 text-red-800 dark:text-red-400">
					This view is not optimised for narrow screens and might render
					incorrectly
				</div>
			</>,
		);

		return () => setActionBar(null);
	}, [
		activeSection.ideaIds.length,
		copyContextToMarkdown,
		creatingSection,
		handleUp,
		isCopied,
		setActionBar,
		showUp,
		treeName,
	]);

	return null;
}

export default TreeActionBar;
