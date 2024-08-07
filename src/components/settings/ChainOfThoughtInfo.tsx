import React from 'react';
import styled from 'styled-components';
import InfoModal from '../common/InfoModal';
import { aiFont } from '../../styles/mixins';
import ChatDaemon from '../../daemons/chatDaemon';
import { Hint } from '../../styles/sharedStyles';


const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 0px;
  padding: 20px 20px 0px 20px;
  align-tems: 'center';
`;

const GridItem = styled.div`
  padding: 2px;
  margin: 4px 4px 16px 4px;
  display: flex;
  align-items: center;
`;

const Variable = styled(GridItem)`
  ${aiFont};
  border-right: 0.5px solid var(--line-color-strong);
  justify-content: center;
`;

const Definition = styled(GridItem)`
  color: var(--text-color-secondary);
  font-size: 0.9em;
  width: 100%;
  text-align: right;
  justify-content: right;
`;


const ChainOfThoughtInfo: React.FC = () => {
  return (
    <InfoModal>
      <div style={{ height: '20px' }}></div>
      <Hint>
        The following variables are available in chain-of-thought prompts:
      </Hint>
      <GridContainer>
        <Variable>{ChatDaemon.PAST_VAR}</Variable>
        <Definition>Past user-generated thoughts as a list. 'Ask AI' instructions, as well as responses, are omitted.</Definition>
        <Variable>{ChatDaemon.CURRENT_VAR}</Variable>
        <Definition>The thought selected as the subject for the comment.</Definition>
      </GridContainer>
    </InfoModal>
  );
};

export default ChainOfThoughtInfo;

