import { useEffect, useRef, useState } from 'react';
import { addChatDaemon, updateChatDaemon } from "../../redux/daemonSlice"
import { ChatDaemonConfig } from '../../redux/models';
import styled from 'styled-components';
import { useAppDispatch } from '../../hooks';
import { ButtonSmall, TextArea, TextButton } from '../../styles/sharedStyles';


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

  const [name, setName] = useState(config.name) || '';
  const [description, setDescription] = useState(config.description || '');
  const [rules, setRules] = useState(config.rules || '');

  const dispatch = useAppDispatch();

  const nameRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const rulesRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = (textArea: HTMLTextAreaElement | null) => {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    // Adjust the height of the text areas
    if (!isCollapsed) {
      resizeTextArea(descriptionRef.current);
      resizeTextArea(rulesRef.current);
    }
  }, [description, rules, isCollapsed]);

  const updateDaemonConfig = () => {
    try {
      const newConfig = {
        ...config,
        name: name,
        description: description,
        rules: rules,
        enabled: isEnabled,
      };
      if (isNewDaemon) {
        dispatch(addChatDaemon(newConfig));
      } else {
        dispatch(updateChatDaemon(newConfig));
      }
      setIsEdited(false);
    } catch (error) {
      console.error("Failed to update config:", error);
      // TODO: Handle the error state appropriately, e.g., show an error message to the user
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
          <ButtonSmall onClick={updateDaemonConfig}>
            Save
          </ButtonSmall>
        )}
      </span>
      {!isCollapsed && (
        <>
          <br />
          <label>
            Name:
            <TextArea
              ref={nameRef}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsEdited(true);
              }}
              style={{ width: '100%', height: 'min-content' }}
            />
          </label>
          <br />
          <label>
            Description:
            <TextArea
              ref={descriptionRef}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Rules:
            <TextArea
              ref={rulesRef}
              value={rules}
              onChange={(e) => {
                setRules(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%'}}
            />
          </label>
        </>
      )}
    </ChatDaemonSettingsContainer>
  );
};

export default ChatDaemonSettings;