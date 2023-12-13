import styled from "styled-components";
import { IconButton } from "../styles/SharedStyles";
import { FiX } from "react-icons/fi";
import { useEffect } from "react";

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99;
`;

const StyledModal = styled.div`
 position: fixed;
 top: 10%;
 left: 50%;
 transform: translateX(-50%);
 z-index: 100;
`;

const ExitButton = styled(IconButton).attrs({
  as: FiX
})`
  position: fixed;
  top: 4px;
  right: 8px;
  cursor: pointer;
`;

const Modal: React.FC<{ children: React.ReactNode, toggleVisibility: () => void }> = ({ children, toggleVisibility }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <Backdrop onClick={toggleVisibility} />
      <StyledModal>
        <ExitButton onClick={toggleVisibility} />
        {children}
      </StyledModal>
    </>
  );
};

export default Modal;