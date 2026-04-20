import type React from "react";
import ChatDaemon from "../../daemons/chatDaemon";
import { DialogDescription, DialogTitle } from "../ui/Dialog";

const ChainOfThoughtInfo: React.FC = () => {
	return (
		<>
			<DialogTitle className="sr-only">
				Chain-of-thought prompt variables
			</DialogTitle>
			<DialogDescription className="sr-only">
				Available variables for chain-of-thought prompts
			</DialogDescription>
			<div style={{ height: "20px" }} />
			<div className="text-[0.85em] text-[var(--text-color-tertiary)]">
				The following variables are available in chain-of-thought prompts:
			</div>
			<div className="grid grid-cols-[auto_auto] gap-0 p-[20px_20px_0px_20px] items-center">
				<div className="p-0.5 m-[4px_4px_16px_4px] flex items-center font-ai text-[0.8em] border-r-[0.5px] border-r-[var(--line-color-strong)] justify-center">
					{ChatDaemon.PAST_VAR}
				</div>
				<div className="p-0.5 m-[4px_4px_16px_4px] flex items-center text-[var(--text-color-secondary)] text-[0.9em] w-full text-right justify-end">
					Past user-generated thoughts as a list. 'Ask AI' instructions, as well
					as responses, are omitted.
				</div>
				<div className="p-0.5 m-[4px_4px_16px_4px] flex items-center font-ai text-[0.8em] border-r-[0.5px] border-r-[var(--line-color-strong)] justify-center">
					{ChatDaemon.CURRENT_VAR}
				</div>
				<div className="p-0.5 m-[4px_4px_16px_4px] flex items-center text-[var(--text-color-secondary)] text-[0.9em] w-full text-right justify-end">
					The thought selected as the subject for the comment.
				</div>
			</div>
		</>
	);
};

export default ChainOfThoughtInfo;
