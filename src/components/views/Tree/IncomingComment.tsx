import type React from "react";
import TypingAnimation from "../../../animations/typingAnimation/TypingAnimation";

const IncomingComment: React.FC<{ daemonName: string }> = ({ daemonName }) => {
	return (
		<div
			className="w-full box-border relative px-3 py-1.5 text-[var(--text-color-secondary)] font-ai text-[0.8em] animate-fade-in"
			key="Incoming"
		>
			<div className="text-right text-[var(--accent-color-coral)] opacity-50">
				{daemonName}
			</div>
			<div className="text-left opacity-50 h-5">
				<TypingAnimation />
			</div>
		</div>
	);
};

export default IncomingComment;
