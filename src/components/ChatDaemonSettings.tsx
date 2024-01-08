import { useState } from 'react';
import { addChatDaemon, updateChatDaemon } from "../redux/daemonSlice"
import { ChatDaemonConfig } from '../redux/models';
import styled from 'styled-components';
import { useAppDispatch } from '../hooks';
import { Button, TextArea, TextButton } from '../styles/SharedStyles';


const ChatDaemonSettingsContainer = styled.div`
  text-align: left;
`;

type ChatDaemonSettingsProps = {
  config: ChatDaemonConfig;
  isNewDaemon: boolean;
};

const ChatDaemonSettings: React.FC<ChatDaemonSettingsProps> = ({ config, isNewDaemon }) => {
  const [isCollapsed, setIsCollapsed] = useState(!isNewDaemon);
  const [isEnabled, setIsEnabled] = useState(config.enabled);
  const [isEdited, setIsEdited] = useState(false);
  const [json, setJson] = useState(() => {
    const { id, enabled, ...editableFields } = config;
    return JSON.stringify(editableFields, null, 2);
  })
  const dispatch = useAppDispatch();

  const updateDaemonConfig = () => {
    try {
      const newConfig = JSON.parse(json);
      newConfig.id = config.id;
      newConfig.enabled = isEnabled;
      if (isNewDaemon) {
        dispatch(addChatDaemon(newConfig));
      } else {
        dispatch(updateChatDaemon(newConfig));
      }
      setIsEdited(false);
    } catch (error) {
      console.error("Failed to parse JSON:", error); // TODO If the json is incorrect, show an error to the user
    }
  }

  // TODO Styling for the checkbox
  return (
    <ChatDaemonSettingsContainer>
      <span>
        <input type="checkbox" checked={isEnabled} onChange={(e) => { setIsEnabled(e.target.checked); setIsEdited(true); }} /> 
        <TextButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <span>{isCollapsed ? '▼' : '▲'} </span>
          {isNewDaemon && (<>New daemon</>)}
          {config.name}
        </TextButton>
        {isEdited && (
          <Button onClick={updateDaemonConfig}>
            Save
          </Button>
        )}
      </span>
      {!isCollapsed && (
        <TextArea
          value={json}
          onChange={(e) => {
            setJson(e.target.value);
            setIsEdited(true);
          }}
          style={{ width: '100%', minHeight: '150px' }}
        />
      )}
    </ChatDaemonSettingsContainer>
  );
};

export default ChatDaemonSettings;