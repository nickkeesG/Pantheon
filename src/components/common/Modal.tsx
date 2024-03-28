import styled from "styled-components";
import { IconButtonLarge } from "../../styles/sharedStyles";
import { FiX } from "react-icons/fi";
import { useEffect } from "react";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const StyledModal = styled.div`
 position: fixed;
 top: 10%;
 left: 50%;
 transform: translateX(-50%);
`;

const ExitButton = styled(IconButtonLarge).attrs({
  as: FiX
})`
  position: fixed;
  top: 4px;
  right: 8px;
  cursor: pointer;
`;

const Modal: React.FC<{
  children: React.ReactNode,
  toggleVisibility: () => void,
  zIndex?: number
}> = ({ children, toggleVisibility, zIndex }) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // TODO Right now this will propagate and close all open modals - we need some kind of modal manager
        toggleVisibility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [toggleVisibility]);

  return (
    <>
      <Backdrop onClick={toggleVisibility} style={{ zIndex: zIndex ? zIndex : 100 }} />
      <StyledModal style={{ zIndex: zIndex ? zIndex + 1 : 101 }}>
        <ExitButton onClick={toggleVisibility} />
        {children}
      </StyledModal>
    </>
  );
};

export default Modal;