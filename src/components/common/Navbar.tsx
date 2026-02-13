import { FiPlus } from "react-icons/fi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { createTree } from "../../redux/thunks";
import { IconButtonMedium } from "../../styles/sharedStyles";
import Settings from "../settings/Settings";
import WelcomeInfoButton from "../WelcomeInfoButton";
import { useActionBar } from "./ActionBarContext";
import PantheonLogo from "./PantheonLogo";

function Navbar() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { actionBar } = useActionBar();

	const handleCreateTree = () => {
		const treeId = Date.now();
		dispatch(createTree(treeId));
		navigate(`/tree/${treeId}`);
	};

	return (
		<div className="sticky top-0 z-50">
			<div className="w-full box-border flex flex-row justify-between items-center gap-1 bg-[var(--bg-color-secondary)] px-8 py-2 border-b border-[var(--line-color)] border-b-[var(--line-color-strong)]">
				<PantheonLogo />
				<div className="flex gap-1 ml-auto">
					<IconButtonMedium title="New tree" onClick={handleCreateTree}>
						<FiPlus />
					</IconButtonMedium>
					<Link to="/collection">
						<IconButtonMedium title="Collection">
							<MdOutlineCollectionsBookmark />
						</IconButtonMedium>
					</Link>
					<Settings />
					<WelcomeInfoButton />
				</div>
			</div>
			{actionBar}
		</div>
	);
}

export default Navbar;
