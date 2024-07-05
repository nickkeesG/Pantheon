import { useEffect } from 'react';
import styled from 'styled-components';
import Modal from './common/Modal';
import { useModal } from './ModalContext';
import { InfoButton } from '../styles/sharedStyles';


const WelcomePanel = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
  width: 40vw;
  max-width: 400px;
  max-height: 60vh;
  overflow-y: auto;
`;

const WelcomeHeader = styled.h3`
  text-align: center;
`;

const InfoModal = () => {
  return (
    <Modal>
      <WelcomePanel>
        <WelcomeHeader>Welcome to Pantheon</WelcomeHeader>
        <p>Pick a topic you would like to make progress on, and make an effort to think out loud, typing out your thoughts as they appear. Daemons will appear to the left and right of your thoughts offering commentary.</p>
        <p>Press ENTER after each thought so they can be added to the context. Try not to wait for the daemons to respond, and treat the page more as a diary or some personal notes. They will share their thoughts when they are ready!</p>
        <p>It is not possible to go back and edit/delete your thoughts, but you can branch your thoughts at any point by clicking the little plus icon next to a thought.</p>
        <p>Some additional features:</p>
        <ul>
          <li>Mentions: Daemons are selected randomly by default. Include @daemon_name to solicit a comment from a specific daemon.</li>
          <li>Ask AI: You can also give direct instructions/questions to the system with "Ask AI." Your instruction will be preceded by all prior thoughts in the current branch.</li>
        </ul>
        <p>Finally, if you would like a fresh page, you can either create a new section of the tree by clicking "New Section," or by creating a completely new tree by clicking the icon in the top left.</p>
      </WelcomePanel>
    </Modal>
  );
}

const WelcomeInfoButton = () => {
  const { addModal } = useModal();

  useEffect(() => {
    const hasSeenWelcomeMessage = localStorage.getItem('hasSeenWelcomeMessage');
    if (!hasSeenWelcomeMessage) {
      addModal(<InfoModal />);
      localStorage.setItem('hasSeenWelcomeMessage', 'true');
    }
  }, [addModal]);

  return (
    <InfoButton onClick={() => addModal(<InfoModal />)} />
  );
};

export default WelcomeInfoButton;