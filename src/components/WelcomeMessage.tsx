import { useState } from 'react';
import styled from 'styled-components';
import Modal from './common/Modal';


const WelcomePanel = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
  width: 40vw; // Adjusted for WelcomePanel
  max-width: 400px; // Adjusted for WelcomePanel
  max-height: 60vh; // Adjusted for WelcomePanel
  overflow-y: auto;
`;

const WelcomeHeader = styled.h3`
  text-align: center;
`;

const WelcomeMessage = () => {
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(
    !localStorage.getItem('hasSeenWelcomeMessage')
  );

  const close = () => {
    setIsWelcomeOpen(false);
    localStorage.setItem('hasSeenWelcomeMessage', 'true');
  }

  return (
    <>
      {isWelcomeOpen && (
        <Modal toggleVisibility={close} zIndex={100}>
          <WelcomePanel>
            <WelcomeHeader>Welcome to Pantheon</WelcomeHeader>
            <p>Pick a topic you would like to make progress on, and make an effort to think out loud, writing out your thoughts as they appear. Daemons will appear to the left and right of your thoughts offering commentary.</p>
          </WelcomePanel>
        </Modal>
      )}
    </>
  );
};

export default WelcomeMessage;