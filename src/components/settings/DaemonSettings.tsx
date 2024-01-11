import { useState } from "react";
import { useAppSelector } from "../../hooks";
import { TextButton } from "../../styles/sharedStyles";
import ChatDaemonSettings from "./ChatDaemonSettings";
import { ChatDaemonConfig } from "../../redux/models";
import BaseDaemonSettings from "./BaseDaemonSettings";


function createEmptyChatDaemonConfig(): ChatDaemonConfig {
  return {
    id: Date.now(),
    name: '',
    description: '',
    rules: '',
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
          Add new daemon
        </TextButton>
      )}
      <h4>Base daemons</h4>
      <BaseDaemonSettings config={baseDaemonConfig} />
    </div>
  )
}

export default DaemonSettings;