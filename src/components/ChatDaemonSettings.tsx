import { useState } from 'react';
import { ChatDaemonConfig, updateChatDaemon } from "../redux/daemonSlice"
import styled from 'styled-components';
import { useAppDispatch } from '../hooks';


const ChatDaemonSettingsContainer = styled.div`
  text-align: left;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color-dark);
  padding: 12px;
`

const SaveButton = styled.button`
  margin: 4px;
`

const ChatDaemonSettings: React.FC<{ config: ChatDaemonConfig }> = ({ config }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [json, setJson] = useState(() => {
    const { id, ...configWithoutId } = config;
    return JSON.stringify(configWithoutId, null, 2);
  })
  const dispatch = useAppDispatch();

  const updateDaemonConfig = () => {
    try {
      const newConfig = JSON.parse(json);
      newConfig.id = config.id;
      dispatch(updateChatDaemon(newConfig));
      setIsEdited(false);
    } catch (error) {
      console.error("Failed to parse JSON:", error); // TODO If the json is incorrect, show an error to the user
    }
  }

  return (
    <ChatDaemonSettingsContainer>
      <span>
        <ExpandButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <span>{isCollapsed ? '▼' : '▲'} </span>
          {config.name}
        </ExpandButton>
        {isEdited && (
          <SaveButton onClick={updateDaemonConfig}>
            Save
          </SaveButton>
        )}
      </span>
      {!isCollapsed && (
        <textarea 
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