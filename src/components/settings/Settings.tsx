import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import styled from 'styled-components';
import { useAppDispatch } from '../../hooks';
import { ButtonDangerous, IconButtonMedium } from '../../styles/sharedStyles';
import Modal from '../common/Modal';
import ConfigSettings from './ConfigSettings';
import DaemonSettings from './DaemonSettings';
import ImportExportButtons from './ImportExportButtons';
import ButtonWithConfirmation from '../common/ButtonWithConfirmation';
import { resetState } from '../../redux/thunks';
import { resetDaemonSlice } from '../../redux/daemonSlice';
import ThemeSettings from './ThemeSettings';

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
  const [key, setKey] = useState(Date.now()) // Key modifier for UI reset

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const resetDaemonSettings = () => {
    dispatch(resetDaemonSlice());
    setKey(Date.now());
  }

  const resetAppState = () => {
    dispatch(resetState());
    setKey(Date.now());
  }

  return (
    <div>
      <SettingsButton title="Settings" onClick={toggleSettings} />
      {isSettingsOpen && (
        <Modal toggleVisibility={toggleSettings} zIndex={100}>
          <SettingsPanel>
            <SettingsHeader>Settings</SettingsHeader>
            <hr />
            <ConfigSettings />
            <hr />
            <DaemonSettings key={key} />
            <hr />
            <ThemeSettings />
            <hr />
            <ImportExportButtons />
            <hr />
            <p style={{ color: 'var(--text-color-dark)' }}>Reset all daemon settings back to default. All custom daemons, and edits made to default daemons, will be lost.</p>
            <ButtonWithConfirmation
              confirmationText="Are you sure you want to reset all daemon settings? This cannot be undone."
              onConfirm={resetDaemonSettings}
            >
              <ButtonDangerous>Reset daemon settings</ButtonDangerous>
            </ButtonWithConfirmation>
            <hr />
            <p style={{ color: 'var(--text-color-dark)' }}>Reset the entire app state back to default. All ideas, comments, and custom daemons will be lost.</p>
            <ButtonWithConfirmation
              confirmationText="Are you sure you want to reset the entire app state? All progress will be lost. This cannot be undone."
              onConfirm={resetAppState}
            >
              <ButtonDangerous>Reset entire app state</ButtonDangerous>
            </ButtonWithConfirmation>
          </SettingsPanel>
        </Modal>
      )}
    </div>
  );
};

export default Settings;