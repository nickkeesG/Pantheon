import { useAppDispatch, useAppSelector } from "../../hooks";
import { addChatDaemon } from "../../redux/daemonSlice";
import type { ChatDaemonConfig } from "../../redux/models";
import { TextButton } from "../ui/Button";
import ChatDaemonSettings from "./ChatDaemonSettings";

function createEmptyChatDaemonConfig(): ChatDaemonConfig {
	return {
		id: Date.now(),
		name: "New Daemon",
		systemPrompt:
			"You are daemon made to be a part of a collective intelligence system.",
		userPrompts: [
			`The user is in the process of writing. Start by reading the user's previous notes:
"
{PAST}
"
Now, here's the user's most recent note:
"
{CURRENT}
"
Leave a useful, short comment on this note. Don't write any more than 1-2 sentences.`,
		],
		enabled: false,
	};
}

const DaemonSettings = () => {
	const chatDaemonConfigs = useAppSelector((state) => state.daemon.chatDaemons);
	const chatModel = useAppSelector((state) => state.config.openAI.chatModel);

	const dispatch = useAppDispatch();

	const addNewDaemon = () => {
		const newDaemon = createEmptyChatDaemonConfig();
		dispatch(addChatDaemon(newDaemon));
	};

	return (
		<div>
			<h4>Daemons</h4>
			<div className="text-[0.85em] text-[var(--text-color-tertiary)] pb-2">
				Daemons are the characters leaving comments on what you write. They are
				powered by the given <i>chat model</i> (currently <b>{chatModel}</b>).
			</div>
			{chatDaemonConfigs.map((config) => (
				<ChatDaemonSettings key={config.id} config={config} />
			))}
			<TextButton onClick={() => addNewDaemon()}>+ New daemon</TextButton>
		</div>
	);
};

export default DaemonSettings;
