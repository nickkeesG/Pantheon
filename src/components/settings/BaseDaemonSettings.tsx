import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { updateBaseDaemon } from "../../redux/daemonSlice"
import { BaseDaemonConfig } from '../../redux/models';
import BaseDaemon from '../../daemons/baseDaemon';
import styled from 'styled-components';
import { Button, ContainerHorizontal, Hint, SettingLabel, TextArea, TextButton } from '../../styles/sharedStyles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { dispatchError } from '../../errorHandler';
import { aiFont, styledBackground } from '../../styles/mixins';
import { selectActiveThoughts } from '../../redux/ideaSlice';
import { useModal } from '../ModalContext';
import InfoModal from '../common/InfoModal';


const BaseDaemonSettingsContainer = styled.div`
  text-align: left;
`;

const StyledDiv = styled.div`
  padding: 8px;
  ${styledBackground};
`;

const ExamplePromptDiv = styled.div`
  background-color: var(--bg-color-secondary);
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
  white-space: pre-wrap;
  word-break: break-word;
  ${aiFont};
`;

const useConfigChanged = (config: BaseDaemonConfig, currentState: Partial<BaseDaemonConfig>) => {
  return useMemo(() => {
    return Object.entries(currentState).some(([key, value]) => config[key as keyof BaseDaemonConfig] !== value);
  }, [config, currentState]);
};

type BaseDaemonSettingsProps = {
  config: BaseDaemonConfig;
};

const BaseDaemonSettings: React.FC<BaseDaemonSettingsProps> = ({ config }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const activeThoughts = useAppSelector(selectActiveThoughts);
  const [mainTemplate, setMainTemplate] = useState(config.mainTemplate || '');
  const [ideaTemplate, setIdeaTemplate] = useState(config.ideaTemplate || '');
  const [temperature, setTemperature] = useState(config.temperature !== undefined ? config.temperature : 0.7);
  const mainTemplateRef = useRef<HTMLTextAreaElement>(null);
  const ideaTemplateRef = useRef<HTMLTextAreaElement>(null);
  const { addModal } = useModal();
  const dispatch = useAppDispatch();

  const configChanged = useConfigChanged(config, {
    mainTemplate,
    ideaTemplate,
    temperature
  })

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

  const showExample = useCallback(() => {
    const daemon = new BaseDaemon(config);
    const prompt = daemon.getContext(activeThoughts);
    addModal(
      <InfoModal>
        <br />
        <Hint>Final prompt given to the base model. This is what the AI will see, given these templates, in the selected tree.</Hint>
        <ExamplePromptDiv>
          {prompt}
        </ExamplePromptDiv>
      </InfoModal>
    )
  }, [config, activeThoughts, addModal])

  useEffect(() => {
    if (!configChanged) return;
    try {
      const newConfig = {
        ...config,
        mainTemplate,
        ideaTemplate,
        temperature
      };
      dispatch(updateBaseDaemon(newConfig));
    } catch (error) {
      dispatchError("Failed to update config: " + error)
    }
  }, [dispatch, config, configChanged, mainTemplate, ideaTemplate, temperature]);

  return (
    <BaseDaemonSettingsContainer>
      <span>
        <TextButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <span>{isCollapsed ? '▼' : '▲'} </span>
          AI suggestions settings
        </TextButton>
      </span>
      {!isCollapsed && (
        <StyledDiv>
          <label>
            <SettingLabel>Main template</SettingLabel>
            <TextArea
              ref={mainTemplateRef}
              value={mainTemplate}
              onChange={(e) => {
                setMainTemplate(e.target.value);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
          <label>
            <SettingLabel>Idea template</SettingLabel>
            <TextArea
              ref={ideaTemplateRef}
              value={ideaTemplate}
              onChange={(e) => {
                setIdeaTemplate(e.target.value);
                resizeTextArea(e.target);
              }}
              style={{ width: '100%' }}
            />
          </label>
          <Button onClick={showExample}>Show example prompt</Button>
          <label>
            <SettingLabel>Temperature</SettingLabel>
            <ContainerHorizontal>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ padding: '4px 8px 4px 16px' }}>{temperature.toFixed(2)}</div>
            </ContainerHorizontal>
          </label>
        </StyledDiv>
      )}
    </BaseDaemonSettingsContainer >
  );
};

export default BaseDaemonSettings;