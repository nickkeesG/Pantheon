import React from 'react';
import styled from 'styled-components';

const DisplayContainer = styled.div`
  display: flex;
  width: 100%;
`;

const PanelContainer = styled.div`
  flex: 1 1 20%;
  min-width: 20%;
`;

const WritingFieldContainer = styled.div`
  flex: 1 1 60%;
  min-width: 60%;
`;

function Display() {

  return (
    <DisplayContainer>

      <PanelContainer/>
      <WritingFieldContainer/>
      <PanelContainer/>

    </DisplayContainer>
  );
}

export default Display;