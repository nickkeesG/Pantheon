import { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';
import { useAppDispatch } from '../../hooks';
import { ButtonDangerous, IconButtonMedium } from '../../styles/sharedStyles';
import Modal from '../Modal';
import ConfirmationModal from '../ConfirmationModal';
import { resetDaemonState } from '../../redux/daemonSlice';
import KeySettings from './KeySettings';
import DaemonSettings from './DaemonSettings';
import ImportExportButtons from './ImportExportButtons';

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

const Settings = () => {
  const dispatch = useAppDispatch();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [key, setKey] = useState(Date.now()) // Key modifier for UI reset

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleConfirmationModal = () => {
    setIsConfirmationModalOpen(!isConfirmationModalOpen);
  }

  const resetDaemonSettings = () => {
    dispatch(resetDaemonState());
    setKey(Date.now());
    setIsConfirmationModalOpen(false);
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
      <SettingsButton title="Settings" onClick={toggleSettings} />
      {isSettingsOpen && (
        <Modal toggleVisibility={toggleSettings} zIndex={100}>
          <SettingsPanel>
            <SettingsHeader>SETTINGS</SettingsHeader>
            <ImportExportButtons />
            <hr />
            <KeySettings />
            <hr style={{ marginTop: '15px' }} />
            <DaemonSettings key={key} />
            <hr style={{ marginBottom: '10px' }} />
            <ButtonDangerous onClick={toggleConfirmationModal}>
              Reset daemon settings
            </ButtonDangerous>
          </SettingsPanel>
        </Modal>
      )}
      {isConfirmationModalOpen && (
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