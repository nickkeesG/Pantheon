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
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt || '');
  const [userPrompts, setUserPrompts] = useState(config.userPrompts || []);

  const dispatch = useAppDispatch();

  const nameRef = useRef<HTMLTextAreaElement>(null);
  const systemPromptRef = useRef<HTMLTextAreaElement>(null);
  const userPromptRefs = useRef<HTMLTextAreaElement[]>([]);

  const handleUserPromptChange = (index: number, value: string, textArea: HTMLTextAreaElement) => {
    const newUserPrompts = [...userPrompts];
    newUserPrompts[index] = value;
    setUserPrompts(newUserPrompts);
    setIsEdited(true);
    resizeTextArea(textArea);
  }

  const addUserPrompt = () => {
    setUserPrompts([...userPrompts, '']);
    setIsEdited(true);
  }

  const deleteUserPrompt = (index: number) => {
    if (userPrompts.length > 1) {
      const updatedPrompts = [...userPrompts.slice(0, index), ...userPrompts.slice(index + 1)];
      setUserPrompts(updatedPrompts);
      setIsEdited(true);
    }
  };

  const resizeTextArea = (textArea: HTMLTextAreaElement | null) => {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (!isCollapsed) {
      resizeTextArea(systemPromptRef.current);
      userPromptRefs.current.forEach((ref) => resizeTextArea(ref));
    }
  }, [systemPrompt, userPrompts, isCollapsed]);

  const updateDaemonConfig = () => {
    try {
      const newConfig = {
        ...config,
        name: name,
        systemPrompt: systemPrompt,
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
            System Prompt:
            <TextArea
              ref={systemPromptRef}
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
          <br />
          <label>User Prompts:</label>
          {userPrompts.map((prompt, index) => (
            <div key={index}>
              <TextArea
                ref={(el) => userPromptRefs.current[index] = el as HTMLTextAreaElement}
                value={prompt}
                onChange={(e) => handleUserPromptChange(index, e.target.value, e.target)}
                style={{ width: '100%' }}
              />
              <ButtonSmall onClick={() => deleteUserPrompt(index)}>
                Delete
              </ButtonSmall>
            </div>
          ))}
          <ButtonSmall onClick={addUserPrompt}>
            Add Prompt
          </ButtonSmall>
        </>
      )}
    </ChatDaemonSettingsContainer>
  );
};

export default ChatDaemonSettings;