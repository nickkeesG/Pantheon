import React from 'react';
import styled from 'styled-components';
import InputBox from './InputBox';

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

function Display() {

  return (
    <DisplayContainer>

      <PanelContainer/>
      <WritingFieldContainer>
        <HistoryContainer/>
        <div>
          <InputBox/>
        </div>
      </WritingFieldContainer>
      <PanelContainer/>

    </DisplayContainer>
  );
}

export default Display;