import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import { createTree } from "../../redux/thunks";
import { IconButtonMedium } from "../../styles/sharedStyles";
import Settings from "../settings/Settings";
import WelcomeInfoButton from "../WelcomeInfoButton";
import PantheonLogo from "./PantheonLogo";

function Navbar() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const handleCreateTree = () => {
		const treeId = Date.now();
		dispatch(createTree(treeId));
		navigate(`/tree/${treeId}`);
	};

	return (
		<div className="fixed top-0 left-0 w-full box-border flex flex-row justify-between items-center gap-1 bg-[var(--bg-color-secondary)] px-4 py-2 z-50 border-t-[0.5px_solid_var(--line-color)] border-b-[0.5px_solid_var(--line-color-strong)]">
			<PantheonLogo />
			<div className="flex gap-1 ml-auto">
				<IconButtonMedium title="New tree" onClick={handleCreateTree}>
					+
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
	);
}

export default Navbar;
