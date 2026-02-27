import { useEffect, useState } from "react";
import { ButtonSmall, InfoButton } from "../styles/sharedStyles";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog";

const steps = [
	<>
		<h3 className="text-center text-xl my-4">Welcome to Pantheon</h3>
		<p>
			<b>Pick a topic</b> you would like to make progress on, and make an effort
			to think out loud, typing out your thoughts as they appear. <b>Daemons</b>{" "}
			will appear to the left and right of your thoughts offering commentary.
		</p>
		<p>
			Press <b>ENTER</b> after each thought so they can be added to the context.
			Try not to wait for the daemons to respond, and treat the page more as a
			diary or some personal notes. They will share their thoughts when they are
			ready!
		</p>
	</>,
	<>
		<h3 className="text-center text-xl my-4">Branching & Editing</h3>
		<p>
			It is not possible to go back and edit/delete your thoughts, but you can{" "}
			<b>branch</b> your thoughts at any point by clicking the little plus icon
			next to a thought.
		</p>
		<p>
			If you would like a fresh page, you can either create a new section of the
			tree by clicking <b>New Section</b>, or create a completely new tree by
			clicking the icon in the top left.
		</p>
	</>,
	<>
		<h3 className="text-center text-xl my-4">Additional Features</h3>
		<ul className="space-y-2">
			<li>
				<b>Mentions:</b> Daemons are selected randomly by default. Include{" "}
				<code>@daemon_name</code> to solicit a comment from a specific daemon.
			</li>
			<li>
				<b>Ask AI:</b> You can also give direct instructions/questions to the
				system with "Ask AI." Your instruction will be preceded by all prior
				thoughts in the current branch.
			</li>
		</ul>
	</>,
];

export const WelcomeInfoContent = () => {
	const [step, setStep] = useState(0);

	useEffect(() => {
		localStorage.setItem("hasSeenWelcomeMessage", "true");
	}, []);

	return (
		<>
			<DialogTitle className="sr-only">Welcome</DialogTitle>
			<DialogDescription className="sr-only">
				Introduction to Pantheon
			</DialogDescription>
			<div className="flex flex-col h-[300px]">
				<div className="flex-1 space-y-4">{steps[step]}</div>
				<div className="flex justify-between items-center pt-2">
					<span className="text-[var(--text-color-tertiary)] text-sm">
						{step + 1} / {steps.length}
					</span>
					<div className="flex gap-2">
						{step > 0 && (
							<ButtonSmall onClick={() => setStep(step - 1)}>Back</ButtonSmall>
						)}
						{step < steps.length - 1 ? (
							<ButtonSmall onClick={() => setStep(step + 1)}>Next</ButtonSmall>
						) : (
							<DialogClose asChild>
								<ButtonSmall>Done</ButtonSmall>
							</DialogClose>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

const WelcomeInfoButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<InfoButton />
			</DialogTrigger>
			<DialogContent>
				<WelcomeInfoContent />
			</DialogContent>
		</Dialog>
	);
};

export default WelcomeInfoButton;
