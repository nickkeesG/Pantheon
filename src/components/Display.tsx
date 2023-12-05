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
  display: flex;
  flex-direction: column;
  flex: 1 1 60%;
  min-width: 60%;
`;

const HistoryContainer = styled.div`
  height: 200px; /* Default height */
  background-color: blue; /* Default color */
`;

const InputBoxContainer = styled.div`
  height: 50px; /* Default height */
  background-color: red; /* Default color */
`;

function Display() {

  return (
    <DisplayContainer>

      <PanelContainer/>
      <WritingFieldContainer>
        <HistoryContainer/>
        <InputBoxContainer/>
      </WritingFieldContainer>
      <PanelContainer/>

    </DisplayContainer>
  );
}

export default Display;