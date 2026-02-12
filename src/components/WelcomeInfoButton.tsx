import { useEffect } from "react";
import { InfoButton } from "../styles/sharedStyles";
import Modal from "./common/Modal";
import { useModal } from "./ModalContext";

const InfoModal = () => {
	return (
		<Modal>
			<div className="p-5 bg-[var(--bg-color)] text-[var(--text-color)] rounded-[10px] border-[0.5px] border-[var(--line-color)] w-[90vw] max-w-[700px] max-h-[60vh] overflow-y-auto space-y-4">
				<h3 className="text-center text-xl my-4">Welcome to Pantheon</h3>
				<p>
					<b>Pick a topic</b> you would like to make progress on, and make an
					effort to think out loud, typing out your thoughts as they appear.{" "}
					<b>Daemons</b> will appear to the left and right of your thoughts
					offering commentary.
				</p>
				<p>
					Press <b>ENTER</b> after each thought so they can be added to the
					context. Try not to wait for the daemons to respond, and treat the
					page more as a diary or some personal notes. They will share their
					thoughts when they are ready!
				</p>
				<p>
					It is not possible to go back and edit/delete your thoughts, but you
					can <b>branch</b> your thoughts at any point by clicking the little
					plus icon next to a thought.
				</p>
				<p>Some additional features:</p>
				<ul>
					<li>
						<b>Mentions:</b> Daemons are selected randomly by default. Include
						@daemon_name to solicit a comment from a specific daemon.
					</li>
					<li>
						<b>Ask AI:</b> You can also give direct instructions/questions to
						the system with "Ask AI." Your instruction will be preceded by all
						prior thoughts in the current branch.
					</li>
				</ul>
				<p>
					Finally, if you would like a fresh page, you can either create a new
					section of the tree by clicking <b>New Section</b>, or by creating a
					completely new tree by clicking the icon in the top left.
				</p>
			</div>
		</Modal>
	);
};

const WelcomeInfoButton = () => {
	const { addModal } = useModal();

	useEffect(() => {
		const hasSeenWelcomeMessage = localStorage.getItem("hasSeenWelcomeMessage");
		if (!hasSeenWelcomeMessage) {
			addModal(<InfoModal />);
			localStorage.setItem("hasSeenWelcomeMessage", "true");
		}
	}, [addModal]);

	return <InfoButton onClick={() => addModal(<InfoModal />)} />;
};

export default WelcomeInfoButton;
