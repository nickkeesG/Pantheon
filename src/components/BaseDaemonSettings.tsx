import { useMemo, useState } from 'react';
import { BaseDaemonConfig, updateBaseDaemon} from "../redux/daemonSlice"
import BaseDaemon from '../daemons/BaseDaemon';
import styled from 'styled-components';
import { Button, TextArea, TextButton } from '../styles/SharedStyles';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectCommentsGroupedByIdeaIds, selectIdeasUpToMaxCommented } from '../redux/textSlice';


const BaseDaemonSettingsContainer = styled.div`
  text-align: left;
`;

type BaseDaemonSettingsProps = {
  config: BaseDaemonConfig;
};

const BaseDaemonSettings: React.FC<BaseDaemonSettingsProps> = ({ config }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [json, setJson] = useState(() => {
    const {...editableFields } = config;
    return JSON.stringify(editableFields, null, 2);
  })
  const [rawContext, setRawContext] = useState('');
  const pastIdeas = useAppSelector(selectIdeasUpToMaxCommented);
  const pastIdeaIds = useMemo(() => pastIdeas.map(idea => idea.id), [pastIdeas]);
  const commentsForPastIdeas = useAppSelector(state => selectCommentsGroupedByIdeaIds(state, pastIdeaIds, 'chat'));
  const dispatch = useAppDispatch();

  const getRawContext = () => {
    console.log('Getting raw context');
    try {
      const daemon = new BaseDaemon(config);
      setRawContext(daemon.getContext(pastIdeas, commentsForPastIdeas));
      console.log('Raw context:', rawContext)
    }
    catch (error) {
      console.error("Failed to get raw context:", error); // TODO show an error to the user
    }
  }

  const updateDaemonConfig = () => {
    try {
      const newConfig = JSON.parse(json);
      dispatch(updateBaseDaemon(newConfig));
      setIsEdited(false);
    } catch (error) {
      console.error("Failed to parse JSON:", error); // TODO show an error to the user
    }
  }

  return (
    <BaseDaemonSettingsContainer>
      <span>
        <TextButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <span>{isCollapsed ? '▼' : '▲'} </span>
          Base Daemon Config
        </TextButton>
        {isEdited && (
          <Button onClick={updateDaemonConfig}>
            Save
          </Button>
        )}
      </span>
      {!isCollapsed && (
        <TextArea
          value={json}
          onChange={(e) => { 
            setJson(e.target.value); 
            setIsEdited(true); 
          }}
          style={{ width: '100%', minHeight: '100px' }}
        />
      )}
      {!isCollapsed && (
        <div>
          <Button onClick={() => getRawContext()}>View Raw Context</Button>
          {rawContext && (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {rawContext}
            </pre>
          )}
        </div>
      )}
      
    </BaseDaemonSettingsContainer>
  );
};
export default BaseDaemonSettings;