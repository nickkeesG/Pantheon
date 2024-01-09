import { useMemo, useState } from 'react';
import { updateBaseDaemon } from "../../redux/daemonSlice"
import { BaseDaemonConfig } from '../../redux/models';
import BaseDaemon from '../../daemons/baseDaemon';
import styled from 'styled-components';
import { Button, ButtonSmall, TextArea, TextButton } from '../../styles/sharedStyles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectCommentsGroupedByIdeaIds, selectIdeasUpToMaxCommented } from '../../redux/textSlice';


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
    const { ...editableFields } = config;
    return JSON.stringify(editableFields, null, 2);
  })
  const [rawContext, setRawContext] = useState('');
  const pastIdeas = useAppSelector(selectIdeasUpToMaxCommented);
  const pastIdeaIds = useMemo(() => pastIdeas.map(idea => idea.id), [pastIdeas]);
  const commentsForPastIdeas = useAppSelector(state => selectCommentsGroupedByIdeaIds(state, pastIdeaIds, 'chat'));
  const dispatch = useAppDispatch();

  const getRawContext = () => {
    try {
      const daemon = new BaseDaemon(config);
      setRawContext(daemon.getPastContext(pastIdeas, commentsForPastIdeas));
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
          Base daemon config
        </TextButton>
        {isEdited && (
          <ButtonSmall onClick={updateDaemonConfig}>
            Save
          </ButtonSmall>
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
          {!rawContext && <Button onClick={() => getRawContext()}>View raw context</Button>}
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