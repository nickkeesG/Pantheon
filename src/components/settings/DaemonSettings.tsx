import { useState } from "react";
import { useAppSelector } from "../../hooks";
import { TextButton } from "../../styles/sharedStyles";
import ChatDaemonSettings from "./ChatDaemonSettings";
import { ChatDaemonConfig } from "../../redux/models";
import BaseDaemonSettings from "./BaseDaemonSettings";


function createEmptyChatDaemonConfig(): ChatDaemonConfig {
  return {
    id: Date.now(),
    name: 'New Daemon',
    systemPrompt: 'You are daemon made to be a part of a collective intelligence system.',
    userPrompts: [`The human user has failed to initialize your prompts.
Please ask the user to go to the settings and initialize your prompts.
Don't write more than one sentence.`],
    enabled: false
  };
}

const DaemonSettings = () => {
  const chatDaemonConfigs = useAppSelector(state => state.daemon.chatDaemons);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [addingNewDaemon, setAddingNewDaemon] = useState(false);

  return (
    <div>
      <h4>Chat daemons</h4>
      {chatDaemonConfigs.map((config) => (
        <ChatDaemonSettings key={config.id} config={config} isNewDaemon={false} />
      ))}
      {addingNewDaemon && (
        <ChatDaemonSettings key={"new"} config={createEmptyChatDaemonConfig()} isNewDaemon={true} />
      )}
      {!addingNewDaemon && (
        <TextButton onClick={() => setAddingNewDaemon(true)}>
          + New daemon
        </TextButton>
      )}
      <h4>Base daemons</h4>
      <BaseDaemonSettings config={baseDaemonConfig} />
    </div>
  )
}

export default DaemonSettings;