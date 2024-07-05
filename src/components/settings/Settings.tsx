import { useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import { useAppDispatch } from '../../hooks';
import { ButtonDangerous, Hint, IconButtonMedium, ModalBox, ModalHeader } from '../../styles/sharedStyles';
import Modal from '../common/Modal';
import ConfigSettings from './ConfigSettings';
import DaemonSettings from './DaemonSettings';
import ImportExportButtons from './ImportExportButtons';
import ButtonWithConfirmation from '../common/ButtonWithConfirmation';
import { resetState } from '../../redux/thunks';
import { resetDaemonSlice } from '../../redux/daemonSlice';
import ThemeSettings from './ThemeSettings';
import { useModal } from '../ModalContext';


const Settings = () => {
  const dispatch = useAppDispatch();
  const [key, setKey] = useState(Date.now()) // Key modifier for UI reset
  const { addModal } = useModal();

  const openSettings = () => {
    addModal(<Modal>
      <ModalBox style={{ width: '70vw', maxWidth: '550px' }}>
        <ModalHeader>Settings</ModalHeader>
        <hr />
        <ConfigSettings />
        <hr />
        <DaemonSettings key={key} />
        <hr />
        <ThemeSettings />
        <hr />
        <ImportExportButtons />
        <hr />
        <Hint>Reset all daemon settings back to default. All custom daemons, and edits made to default daemons, will be lost.</Hint>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonWithConfirmation
            confirmationText="Are you sure you want to reset all daemon settings? This cannot be undone."
            onConfirm={resetDaemonSettings}
          >
            <ButtonDangerous>Reset daemon settings</ButtonDangerous>
          </ButtonWithConfirmation>
        </div>
        <hr />
        <Hint>Reset the entire app state back to default. All ideas, comments, and custom daemons will be lost.</Hint>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonWithConfirmation
            confirmationText="Are you sure you want to reset the entire app state? All progress will be lost. This cannot be undone."
            onConfirm={resetAppState}
          >
            <ButtonDangerous>Reset entire app state</ButtonDangerous>
          </ButtonWithConfirmation>
        </div>
      </ModalBox>
    </Modal>);
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
    <IconButtonMedium
      title="Settings"
      onClick={openSettings}>
      <FiSettings />
    </IconButtonMedium>
  );
};

export default Settings;