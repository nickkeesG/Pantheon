import {useEffect, useRef, useState} from 'react';
import {updateInstructDaemon} from '../../redux/daemonSlice';
import {InstructDaemonConfig} from '../../redux/models';
import styled from 'styled-components';
import {useAppDispatch} from '../../hooks';
import {ButtonSmall, TextArea, TextButton} from '../../styles/sharedStyles';

const InstructDaemonSettingsContainer = styled.div`
  text-align: left;
`;

type InstructDaemonSettingsProps = {
  config: InstructDaemonConfig;
};

const InstructDaemonSettings: React.FC<InstructDaemonSettingsProps> = ({config}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt || '');
  const [userPrompt, setUserPrompt] = useState(config.userPrompt || '');

  const dispatch = useAppDispatch();

  const systemPromptRef = useRef<HTMLTextAreaElement>(null);
  const userPromptRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = (textArea: HTMLTextAreaElement | null) => {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (!isCollapsed) {
      resizeTextArea(systemPromptRef.current);
      resizeTextArea(userPromptRef.current);
    }
  }, [systemPrompt, userPrompt, isCollapsed]);

  const updateDaemonConfig = () => {
    try {
      const updatedConfig = {...config, systemPrompt, userPrompt};
      dispatch(updateInstructDaemon(updatedConfig));
      setIsEdited(false);
    } catch (error) {
      console.error('Failed to update instruct daemon config:', error);
    }
  }

  return (
    <InstructDaemonSettingsContainer>
      <span>
        <TextButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <span>{isCollapsed ? '▼' : '▲'} </span>
          Instruct daemon config
        </TextButton>
        {isEdited && (
          <ButtonSmall onClick={updateDaemonConfig}>
            Save
          </ButtonSmall>
        )}
      </span>
      {!isCollapsed && (
        <>
          <br/>
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
          <label>
            User Prompt:
            <TextArea
              ref={userPromptRef}
              value={userPrompt}
              onChange={(e) => {
                setUserPrompt(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
        </> 
      )}
    </InstructDaemonSettingsContainer>
  );
};

export default InstructDaemonSettings;