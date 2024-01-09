import React, { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../hooks';
import ChatDaemonSettings from './ChatDaemonSettings';
import BaseDaemonSettings from './BaseDaemonSettings';
import { ButtonDangerous, IconButtonMedium, TextButton, TextInput } from '../../styles/sharedStyles';
import { ChatDaemonConfig } from '../../redux/models';
import Modal from '../Modal';
import ConfirmationModal from '../ConfirmationModal';
import { resetDaemonState } from '../../redux/daemonSlice';
import { KeySettings } from './KeySettings';

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
            <KeySettings />
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