import { useState } from "react";
import { useAppSelector } from "../../hooks";
import { TextButton } from "../../styles/sharedStyles";
import ChatDaemonSettings from "./ChatDaemonSettings";
import { ChatDaemonConfig } from "../../redux/models";
import BaseDaemonSettings from "./BaseDaemonSettings";
import InstructDaemonSettings from "./InstructDaemonSettings";


function createEmptyChatDaemonConfig(): ChatDaemonConfig {
  return {
    id: Date.now(),
    name: '',
    systemPrompt: '',
    userPrompts: ['Say something funny!'],
    enabled: false
  };
}

const DaemonSettings = () => {
  const chatDaemonConfigs = useAppSelector(state => state.daemon.chatDaemons);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const instructDaemonConfig = useAppSelector(state => state.daemon.instructDaemon);
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
      <h4>Base daemon</h4>
      <BaseDaemonSettings config={baseDaemonConfig} />
      <h4>Instruct daemon</h4>
      <InstructDaemonSettings config={instructDaemonConfig} />
    </div>
  )
}

export default DaemonSettings;