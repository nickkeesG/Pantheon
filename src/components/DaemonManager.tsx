import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';
import ChatDaemon from '../daemons/chatDaemon';
import { dispatchError } from '../errorHandler';
import { addComment, selectMostRecentCommentForCurrentBranch } from '../redux/commentSlice';
import { selectActiveThoughtsEligibleForComments, selectActiveThoughts } from '../redux/ideaSlice';
import { setIncomingComment } from '../redux/uiSlice';
import { Idea } from '../redux/models';


const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const chatDaemonConfigs = useAppSelector(selectEnabledChatDaemons);
  const [chatDaemons] = useState<ChatDaemon[]>(chatDaemonConfigs.map(config => new ChatDaemon(config)));
  const [chatDaemonActive, setChatDaemonActive] = useState(false);
  const activeThoughts = useAppSelector(selectActiveThoughts);
  const ideasEligibleForComments = useAppSelector(selectActiveThoughtsEligibleForComments);
  const mostRecentComment = useAppSelector(selectMostRecentCommentForCurrentBranch);
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const chatModel = useAppSelector(state => state.config.chatModel);
  const lastTimeActive = useAppSelector(state => state.ui.lastTimeActive);
  const maxSecondsInactive = 3;
  const [newActivity, setNewActivity] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef({
    lastTimeActive,
    newActivity,
    ideasEligibleForComments,
    openAIKey,
    chatDaemons,
    chatDaemonActive,
    activeThoughts,
    mostRecentComment
  });

  useEffect(() => {
    stateRef.current = {
      lastTimeActive,
      newActivity,
      ideasEligibleForComments,
      openAIKey,
      chatDaemons,
      chatDaemonActive,
      activeThoughts,
      mostRecentComment
    };
  }, [lastTimeActive, newActivity, ideasEligibleForComments, openAIKey, chatDaemons, chatDaemonActive, activeThoughts, mostRecentComment]);

  const generateComment = useCallback(async (daemon: ChatDaemon, idea: Idea, pastIdeas: Idea[], column: string,) => {
    try {
      setChatDaemonActive(true);
      dispatch(setIncomingComment({ daemonName: daemon.config.name, ideaId: idea.id, isRight: column === 'right' }));
      const response = await daemon.generateComments(pastIdeas, idea, openAIKey, openAIOrgId, chatModel);
      if (!response) {
        dispatchError("Couldn't generate comment (no response received)");
        return;
      }

      dispatch(addComment({
        ideaId: idea.id,
        text: response.text,
        chainOfThought: response.chainOfThought,
        daemonName: daemon.config.name,
        daemonType: column
      }));
    } catch (error) {
      dispatchError("Unknown error while generating comment");
      console.error(error);
    } finally {
      dispatch(setIncomingComment({}));
      setChatDaemonActive(false);
    }
  }, [chatModel, openAIKey, openAIOrgId, dispatch])

  useEffect(() => {
    const interval = setInterval(() => {
      const { lastTimeActive, newActivity, ideasEligibleForComments, openAIKey, chatDaemons, chatDaemonActive, activeThoughts, mostRecentComment } = stateRef.current;
      if (chatDaemonActive) return;
      const secondsInactive = (new Date().getTime() - lastTimeActive) / 1000
      if (secondsInactive < maxSecondsInactive && !newActivity) {
        setNewActivity(true);
      } else if (
        newActivity &&
        secondsInactive >= maxSecondsInactive
        && ideasEligibleForComments.length > 0
      ) {
        if (!openAIKey) {
          dispatchError("OpenAI API key not set. Enter your key in Settings.");
          return;
        }

        setNewActivity(false);
        const lastCommentColumn = mostRecentComment ? mostRecentComment.daemonType : '';
        const column = lastCommentColumn === 'left' ? 'right' : 'left'; // TODO Fix - 'daemonType' should be changed into 'isRight' or 'column' enum etc
        const selectedIdea = ideasEligibleForComments.find(idea => idea.mention)
          || ideasEligibleForComments[Math.floor(Math.random() * ideasEligibleForComments.length)];
        const daemon = selectedIdea.mention ? chatDaemons.find(daemon => daemon.config.name === selectedIdea.mention) : chatDaemons[Math.floor(Math.random() * chatDaemons.length)]
        if (!daemon) {
          dispatchError("Couldn't generate comment (daemon not found)");
          return;
        }

        const pastIdeas = activeThoughts.slice(0, activeThoughts.indexOf(selectedIdea));
        generateComment(daemon, selectedIdea, pastIdeas, column)
      }
    }, 1000);

    intervalRef.current = interval;

    return () => clearInterval(interval);
  }, [chatModel, dispatch, generateComment]);

  return null;
}

export default DaemonManager;