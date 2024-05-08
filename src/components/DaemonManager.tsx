import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea } from '../redux/models';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';
import ChatDaemon from '../daemons/chatDaemon';
import { dispatchError } from '../errorHandler';
import { addComment } from '../redux/commentSlice';
import { selectActiveIdeasEligibleForComments, selectActivePastIdeas } from '../redux/ideaSlice';

/*
Central controller for the deployment of daemons.
*/
const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.ui.lastTimeActive);
  const [alreadyWasInactive, setAlreadyWasInactive] = useState(false);
  const [chatDaemonActive, setChatDaemonActive] = useState(false);
  const chatDaemonConfigs = useAppSelector(selectEnabledChatDaemons);
  const [chatDaemons, setChatDaemons] = useState<ChatDaemon[]>([]);
  const ideasEligbleForComments = useAppSelector(selectActiveIdeasEligibleForComments);
  const pastIdeas = useAppSelector(selectActivePastIdeas);

  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const chatModel = useAppSelector(state => state.config.chatModel);

  const maxTimeInactive = 3; // seconds

  useEffect(() => {
    const daemons = chatDaemonConfigs.map(config => new ChatDaemon(config));
    setChatDaemons(daemons);
  }, [chatDaemonConfigs]);

  const dispatchChatComment = useCallback(async (pastIdeas: Idea[], currentIdea: Idea, daemon: ChatDaemon) => {
    setChatDaemonActive(true);
    try {
      // Returns a single comment
      const response = await daemon.generateComments(pastIdeas, currentIdea, openAIKey, openAIOrgId, chatModel);

      if(response) {
        dispatch(addComment({ ideaId: currentIdea.id, text: response, daemonName: daemon.config.name, daemonType: "chat" }));
      }
      else {
        console.error('No chat comment generated');
      }

    } catch (error) {
      dispatchError('Failed to dispatch chat comment'); //send error to user
      console.error(error);
    } finally {
      setChatDaemonActive(false);
    }
  }, [openAIKey, openAIOrgId, chatModel, dispatch]);

  const selectCurrentIdea = useCallback(async (ideasEligbleForComments: Idea[]) => {
    // Ramdomly select an idea
    const currentIdea = ideasEligbleForComments[Math.floor(Math.random() * ideasEligbleForComments.length)];
    return currentIdea;
  }, []);


  const handleDaemonDispatch = useCallback(async() => {
    if(!openAIKey) {
      dispatchError('OpenAI API key not set');
      return;
    }

    if (ideasEligbleForComments.length > 0) {
      if (chatDaemonActive) {
        console.log('Chat daemon already active');
      }
      else {
        // Randomly select a chat daemon
        const chatDaemon = chatDaemons[Math.floor(Math.random() * chatDaemons.length)];
        if (chatDaemon) {
          const currentIdea = await selectCurrentIdea(ideasEligbleForComments);

          if (currentIdea) {
            dispatchChatComment(pastIdeas, currentIdea, chatDaemon);
          }
        }
      }
    }
  }, [ideasEligbleForComments,
    pastIdeas,
    chatDaemonActive,
    chatDaemons,
    openAIKey,
    dispatchChatComment,
    selectCurrentIdea]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > maxTimeInactive && !alreadyWasInactive) {
        console.log('User became inactive');
        setAlreadyWasInactive(true);
        handleDaemonDispatch();
      }
      if (secondsSinceLastActive < maxTimeInactive && alreadyWasInactive) {
        console.log('User became active');
        setAlreadyWasInactive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastTimeActive,
    alreadyWasInactive,
    handleDaemonDispatch]);

  return null;
}

export default DaemonManager;