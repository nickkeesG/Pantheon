import { useAppDispatch, useAppSelector } from "../../hooks";
import { Hint, TextButton } from "../../styles/sharedStyles";
import ChatDaemonSettings from "./ChatDaemonSettings";
import { ChatDaemonConfig } from "../../redux/models";
import BaseDaemonSettings from "./BaseDaemonSettings";
import { addChatDaemon } from "../../redux/daemonSlice"

function createEmptyChatDaemonConfig(): ChatDaemonConfig {
  return {
    id: Date.now(),
    name: 'New Daemon',
    systemPrompt: 'You are daemon made to be a part of a collective intelligence system.',
    userPrompts: [`The user is in the process of writing. Start by reading the user's previous notes:
"
{PAST}
"
Now, here's the user's most recent note:
"
{CURRENT}
"
Leave a useful, short comment on this note. Don't write any more than 1-2 sentences.`],
    enabled: false
  };
}

const DaemonSettings = () => {
  const chatDaemonConfigs = useAppSelector(state => state.daemon.chatDaemons);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const chatModel = useAppSelector(state => state.config.chatModel);
  const baseModel = useAppSelector(state => state.config.baseModel);

  const dispatch = useAppDispatch();

  const addNewDaemon = () => {
    const newDaemon = createEmptyChatDaemonConfig();
    dispatch(addChatDaemon(newDaemon));
  }

  return (
    <div>
      <h4>Daemons</h4>
      <Hint style={{ paddingBottom: '8px' }}>
        Daemons are the characters leaving comments on what you write. They are powered by the given <i>chat model</i> (currently <b>{chatModel}</b>).
      </Hint>
      {chatDaemonConfigs.map((config) => (
        <ChatDaemonSettings key={config.id} config={config} />
      ))}
      <TextButton onClick={() => addNewDaemon()}>
        + New daemon
      </TextButton>
      <h4>Completions</h4>
      <Hint style={{ paddingBottom: '8px' }}>
        Completions are ideas that the AI suggests to the user. They are powered by the given <i>base model</i> (currently <b>{baseModel}</b>).
      </Hint>
      <BaseDaemonSettings config={baseDaemonConfig} />
    </div>
  )
}

export default DaemonSettings;