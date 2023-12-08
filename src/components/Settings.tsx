import React, { useState, useEffect } from 'react';
import { FiSettings, FiX } from 'react-icons/fi';
import styled from 'styled-components';
import { setOpenaiKey, setOpenaiOrgId } from '../redux/textSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

const SettingsButton = styled(FiSettings)`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 12px;
  cursor: pointer;
  z-index: 50;
`;

const ExitButton = styled(FiX)`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 12px;
  cursor: pointer;
`;

const SettingsPanel = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-color-lighter);
  color: var(--main-color);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid var(--line-color-dark);
  width: 50%;
  max-width: 500px;
  text-align: center;
  z-index: 100;
`;

const SettingLabel = styled.p`
  text-align: left;
  font-size: 0.8em;
  margin-bottom: 5px;
`;

const TextSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
  margin: 0 auto;
`;

const TextSettingInput = styled.input`
  padding: 10px;
  width: 94.5%;
  border-radius: 4px;
  color: var(--text-color);
  background-color: var(--bg-color-light);
  border: 1px solid var(--line-color);
  &:focus {
    outline: none;
    border-color: var(--line-color-light); 
  }
`;


const Settings = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const openAIKey = useAppSelector(state => state.text.openAIKey);
  const openAIOrgId = useAppSelector(state => state.text.openAIOrgId);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOpenaiKey(event.target.value));
  };

  const handleOrgIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOpenaiOrgId(event.target.value));
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <SettingsButton onClick={toggleSettings} />
      {isSettingsOpen && (
        <SettingsPanel>
          SETTINGS
          <ExitButton onClick={toggleSettings} />
          <TextSettingContainer>
            <SettingLabel>OpenAI API key</SettingLabel>
            <TextSettingInput 
              placeholder="sk-..." 
              value={openAIKey} 
              onChange={handleApiKeyChange} 
            />
          </TextSettingContainer>
          <TextSettingContainer>
            <SettingLabel>OpenAI organization ID</SettingLabel>
            <TextSettingInput 
              placeholder="org-..." 
              value={openAIOrgId} 
              onChange={handleOrgIdChange} 
            />
          </TextSettingContainer>
        </SettingsPanel>
      )}
    </div>
  );
};

export default Settings;