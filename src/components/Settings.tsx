import React, { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';
import { updateChatModel, updateBaseModel, setOpenaiKey, setOpenaiOrgId } from '../redux/llmSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import ChatDaemonSettings from './ChatDaemonSettings';
import BaseDaemonSettings from './BaseDaemonSettings';
import { ButtonDangerous, IconButtonMedium, TextButton, TextInput } from '../styles/sharedStyles';
import { ChatDaemonConfig } from '../redux/models';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import { resetDaemonState } from '../redux/daemonSlice';

const SettingsButton = styled(IconButtonMedium).attrs({
  as: FiSettings
})`
  display: flex;
`;

const SettingsPanel = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px 44px 20px 20px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
  width: 50vw;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const SettingsHeader = styled.h3`
  text-align: center;
`;

const SettingLabel = styled.p`
  font-size: 0.8em;
  margin-bottom: 5px;
  color: var(--text-color-dark);
`;

const TextSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
`;

function createEmptyChatDaemonConfig(): ChatDaemonConfig {
  return {
    id: Date.now(),
    name: '',
    systemPrompt: '',
    startInstruction: '',
    chainOfThoughtInstructions: [],
    endInstruction: '',
    enabled: false
  };
}

const Settings = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const openAIKey = useAppSelector(state => state.llm.openAIKey);
  const openAIOrgId = useAppSelector(state => state.llm.openAIOrgId);
  const chatModel = useAppSelector(state => state.llm.chatModel);
  const baseModel = useAppSelector(state => state.llm.baseModel);
  const chatDaemonConfigs = useAppSelector(state => state.daemon.chatDaemons);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [addingNewDaemon, setAddingNewDaemon] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [key, setKey] = useState(Date.now()) // Key modifier for UI reset

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  }

  const resetDaemonSettings = () => {
    dispatch(resetDaemonState());
    setKey(Date.now());
    setShowConfirmationModal(false);
    setAddingNewDaemon(false);
  }

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOpenaiKey(event.target.value));
  };

  const handleOrgIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOpenaiOrgId(event.target.value));
  }

  const handleChatModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateChatModel(event.target.value));
  }

  const handleBaseModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateBaseModel(event.target.value));
  }

  useEffect(() => {
    setAddingNewDaemon(false);
  }, [chatDaemonConfigs]);

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
      <SettingsButton title="Settings" onClick={toggleSettings} />
      {isSettingsOpen && (
        <Modal toggleVisibility={toggleSettings} zIndex={100}>
          <SettingsPanel>
            <SettingsHeader>SETTINGS</SettingsHeader>
            <TextSettingContainer>
              <SettingLabel>OpenAI API key</SettingLabel>
              <TextInput
                placeholder="sk-..."
                value={openAIKey}
                onChange={handleApiKeyChange}
              />
            </TextSettingContainer>
            <TextSettingContainer>
              <SettingLabel>OpenAI organization ID</SettingLabel>
              <TextInput
                placeholder="org-..."
                value={openAIOrgId}
                onChange={handleOrgIdChange}
              />
            </TextSettingContainer>
            <TextSettingContainer>
              <SettingLabel>Chat Model</SettingLabel>
              <TextInput
                placeholder={chatModel}
                value={chatModel}
                onChange={handleChatModelChange}
              />
            </TextSettingContainer>
            <TextSettingContainer>
              <SettingLabel>Base Model</SettingLabel>
              <TextInput
                placeholder={baseModel}
                value={baseModel}
                onChange={handleBaseModelChange}
              />
            </TextSettingContainer>
            <hr style={{ marginTop: '15px' }} />
            <h4>Chat daemons</h4>
            <div>
              {chatDaemonConfigs.map((config) => (
                <ChatDaemonSettings key={config.id + key} config={config} isNewDaemon={false} />
              ))}
              {addingNewDaemon && (
                <ChatDaemonSettings key={"new" + key} config={createEmptyChatDaemonConfig()} isNewDaemon={true} />
              )}
              {!addingNewDaemon && (
                <TextButton onClick={() => setAddingNewDaemon(true)}>
                  Add new daemon
                </TextButton>
              )}
            </div>
            <h4>Base Daemons</h4>
            <BaseDaemonSettings key={"base" + key} config={baseDaemonConfig} />
            <hr style={{ marginBottom: '10px' }} />
            <ButtonDangerous onClick={toggleConfirmationModal}>
              Reset daemon settings
            </ButtonDangerous>
          </SettingsPanel>
        </Modal>
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={resetDaemonSettings}
          onCancel={toggleConfirmationModal}
          message="Are you sure you want to reset all daemon settings? This cannot be undone."
          zIndex={120}
        />
      )}
    </div>
  );
};

export default Settings;