import { FaQuestionCircle } from "react-icons/fa";
import { IconButtonMedium } from "../styles/sharedStyles";
import styled from "styled-components";
import { useState } from "react";
import Modal from "./common/Modal";

/*
  Button to get a menu with general tool instructions. (TODO: Add info/instructions)
*/

const InfoButton = styled(IconButtonMedium).attrs({
  as: FaQuestionCircle
})`
  display: flex;
`;

const InfoPanel = styled.div`
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px 44px 20px 20px;
  border-radius: 10px;
  border: 0.5px solid var(--line-color);
  width: 50vw;
  max-width: 1000px;
  max-height: 80vh;
  overflow-y: auto;
`;

const InfoHeader = styled.h3`
  text-align: center;
`;

const Info = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  }

  return (
    <div>
      <InfoButton title="Info" onClick={toggleInfo} />
      {isInfoOpen && (
        <Modal toggleVisibility={toggleInfo} zIndex={100}>
          <InfoPanel>
            <InfoHeader>Info</InfoHeader>
            <p>Include more general tool instructions perhaps?</p>
          </InfoPanel>
        </Modal>
      )}
    </div>
  );
};

export default Info;