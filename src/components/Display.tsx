import React from 'react';
import styled from 'styled-components';
import InputBox from './InputBox';
import HistoryContainer from './HistoryContainer';
import DaemonPanel from './DaemonPanel';

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

function Display() {

  return (
    <DisplayContainer>

      <PanelContainer>
        <DaemonPanel/>
      </PanelContainer>      
      <WritingFieldContainer>
        <HistoryContainer/>
        <InputBox/>
      </WritingFieldContainer>
      <PanelContainer>
        <DaemonPanel/>
      </PanelContainer>  

    </DisplayContainer>
  );
}

export default Display;