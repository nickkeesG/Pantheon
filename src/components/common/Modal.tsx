import styled from "styled-components";
import { ExitButtonLarge } from "../../styles/sharedStyles";
import { useModal } from "../ModalContext";

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
 left: 50%;
 transform: translateX(-50%);
`;

interface ModalProps {
  children: React.ReactNode;
  zIndex?: number;
  top?: string;
}

const Modal: React.FC<ModalProps> = ({ children, zIndex, top }) => {
  const { removeModal } = useModal();

  return (
    <>
      <Backdrop onClick={removeModal} style={{ zIndex: zIndex ? zIndex : 100 }} />
      <StyledModal style={{ zIndex: zIndex ? zIndex + 1 : 101, top: top ? top : '10%' }}>
        <ExitButtonLarge onClick={removeModal} style={{ right: '8px' }} />
        {children}
      </StyledModal>
    </>
  );
};

export default Modal;