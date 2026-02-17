import { LuRotateCcw } from "react-icons/lu";

const ResetButton = ({ onClick }: { onClick: () => void }) => (
	<button
		type="button"
		className="text-[var(--text-color-tertiary)] hover:text-[var(--text-color)] cursor-pointer w-6 h-6 flex items-center justify-center"
		title="Reset to default"
		onClick={onClick}
	>
		<LuRotateCcw className="w-4.5 h-4.5" />
	</button>
);

export default ResetButton;
