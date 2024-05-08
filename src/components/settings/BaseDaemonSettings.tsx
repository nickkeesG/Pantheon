import { useEffect, useMemo, useRef, useState } from 'react';
import { updateBaseDaemon } from "../../redux/daemonSlice"
import { BaseDaemonConfig } from '../../redux/models';
import BaseDaemon from '../../daemons/baseDaemon';
import styled from 'styled-components';
import { Button, ButtonSmall, TextArea, TextButton } from '../../styles/sharedStyles';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectCommentsGroupedByIdeaIds } from '../../redux/commentSlice';
import { selectActivePastIdeas } from '../../redux/ideaSlice';


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
  const pastIdeaIds = useMemo(() => pastIdeas.map(idea => idea.id), [pastIdeas]);
  const commentsForPastIdeas = useAppSelector(state => selectCommentsGroupedByIdeaIds(state, pastIdeaIds, 'chat'));

  const [mainTemplate, setMainTemplate] = useState(config.mainTemplate || '');
  const [ideaTemplate, setIdeaTemplate] = useState(config.ideaTemplate || '');
  const [commentTemplate, setCommentTemplate] = useState(config.commentTemplate || '');

  const mainTemplateRef = useRef<HTMLTextAreaElement>(null);
  const ideaTemplateRef = useRef<HTMLTextAreaElement>(null);
  const commentTemplateRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();

  const resizeTextArea = (textArea: HTMLTextAreaElement | null) => {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    // Adjust the height of the text areas
    if (!isCollapsed) {
      resizeTextArea(mainTemplateRef.current);
      resizeTextArea(ideaTemplateRef.current);
      resizeTextArea(commentTemplateRef.current);
    }
  }, [mainTemplate, ideaTemplate, commentTemplate, isCollapsed]);

  const getRawContext = () => {
    try {
      const daemon = new BaseDaemon(config);
      setRawContext(daemon.getContextWithComments(pastIdeas, commentsForPastIdeas));
    }
    catch (error) {
      console.error("Failed to get raw context:", error); // TODO show an error to the user
    }
  }

  const updateDaemonConfig = () => {
    try {
      const newConfig = {
        ...config,
        mainTemplate: mainTemplate,
        ideaTemplate: ideaTemplate,
        commentTemplate: commentTemplate,
      };
      dispatch(updateBaseDaemon(newConfig));
      setIsEdited(false);
    } catch (error) {
      console.error("Failed to update config:", error);
      // TODO: Handle the error state appropriately, e.g., show an error message to the user
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
          <br/>
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
          <label>
            Comment template:
            <TextArea
              ref={commentTemplateRef}
              value={commentTemplate}
              onChange={(e) => {
                setCommentTemplate(e.target.value);
                setIsEdited(true);
                resizeTextArea(e.target);
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