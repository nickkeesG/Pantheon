import { useEffect, useRef, useState } from 'react';
import { updateBaseDaemon } from "../../redux/daemonSlice"
import { BaseDaemonConfig } from '../../redux/models';
import BaseDaemon from '../../daemons/baseDaemon';
import styled from 'styled-components';
import { Button, ButtonSmall, TextArea, TextButton } from '../../styles/sharedStyles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectActivePastIdeas } from '../../redux/ideaSlice';
import { dispatchError } from '../../errorHandler';


const BaseDaemonSettingsContainer = styled.div`
  text-align: left;
`;

type BaseDaemonSettingsProps = {
  config: BaseDaemonConfig;
};

const BaseDaemonSettings: React.FC<BaseDaemonSettingsProps> = ({ config }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [rawContext, setRawContext] = useState('');
  const pastIdeas = useAppSelector(selectActivePastIdeas);

  const [mainTemplate, setMainTemplate] = useState(config.mainTemplate || '');
  const [ideaTemplate, setIdeaTemplate] = useState(config.ideaTemplate || '');
  const [temperature, setTemperature] = useState(config.temperature !== undefined ? config.temperature : 0.7);

  const mainTemplateRef = useRef<HTMLTextAreaElement>(null);
  const ideaTemplateRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();

  const resizeTextArea = (textArea: HTMLTextAreaElement | null) => {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (!isCollapsed) {
      resizeTextArea(mainTemplateRef.current);
      resizeTextArea(ideaTemplateRef.current);
    }
  }, [mainTemplate, ideaTemplate, isCollapsed]);

  const getRawContext = () => {
    try {
      const daemon = new BaseDaemon(config);
      setRawContext(daemon.getContext(pastIdeas));
    }
    catch (error) {
      dispatchError('Failed to get raw context');
    }
  }

  const updateDaemonConfig = () => {
    try {
      const newConfig = {
        ...config,
        mainTemplate: mainTemplate,
        ideaTemplate: ideaTemplate,
        temperature: temperature,
      };
      dispatch(updateBaseDaemon(newConfig));
      setIsEdited(false);
    } catch (error) {
      dispatchError('Failed to update config' + error);
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
        <>
          <br />
          <label>
            Main template:
            <TextArea
              ref={mainTemplateRef}
              value={mainTemplate}
              onChange={(e) => {
                setMainTemplate(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            Idea template:
            <TextArea
              ref={ideaTemplateRef}
              value={ideaTemplate}
              onChange={(e) => {
                setIdeaTemplate(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
          <br />
          <label>
            Temperature: <span>{temperature.toFixed(2)}</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => {
                setTemperature(parseFloat(e.target.value));
                setIsEdited(true);
              }}
              style={{ width: '100%' }}
            />
          </label>
        </>
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