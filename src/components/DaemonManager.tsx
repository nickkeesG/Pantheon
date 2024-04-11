import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea } from '../redux/models';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';
import ChatDaemon from '../daemons/chatDaemon';
import { dispatchError } from '../errorHandler';
import { addComment, selectMostRecentCommentForCurrentBranch } from '../redux/commentSlice';
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
  const currentIdeas = useAppSelector(selectActiveIdeasEligibleForComments);
  const pastIdeas = useAppSelector(selectActivePastIdeas);

  const mostRecentComment = useAppSelector(selectMostRecentCommentForCurrentBranch);

  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const chatModel = useAppSelector(state => state.config.chatModel);

  const maxTimeInactive = 3; // seconds
  const minCurrentIdeas = 3;

  useEffect(() => {
    const daemons = chatDaemonConfigs.map(config => new ChatDaemon(config));
    setChatDaemons(daemons);
  }, [chatDaemonConfigs]);

  const dispatchComment = useCallback(async (pastIdeas: Idea[], currentIdea: Idea, daemon: ChatDaemon, column: string) => {
    setChatDaemonActive(true);
    try {
      // Returns a single comment
      console.log('Generating chat comment');
      const response = await daemon.generateComment(pastIdeas, currentIdea, openAIKey, openAIOrgId, chatModel);

      if(response) {
        dispatch(addComment({ ideaId: currentIdea.id, text: response, daemonName: daemon.config.name, daemonType: column }));
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



  const selectCurrentIdea = useCallback((pastIdeas: Idea[], currentIdeas: Idea[], daemon: ChatDaemon) => {
    let highestSurprisalIdea: Idea | null = null;
    let highestSurprisalScore = 0;
  
    for (const currentIdea of currentIdeas) {
      const maxSurprisalScore = Math.max(...currentIdea.tokenSurprisals);
      if (maxSurprisalScore > highestSurprisalScore) {
        highestSurprisalScore = maxSurprisalScore;
        highestSurprisalIdea = currentIdea;
      }
    }
  
    return highestSurprisalScore > 0 ? highestSurprisalIdea : null;
  }, []);


  const handleDaemonDispatch = useCallback(async() => {
    if(!openAIKey) {
      dispatchError('OpenAI API key not set');
      return;
    }

    if (chatDaemonActive) {
      console.log('Chat daemon already active');
    }
    else {
      // Handle directly prompted comments
      var daemonExplicitlyMentioned = false;
      if (currentIdeas.length >= 0) {
        for (const idea of currentIdeas) {
          for (const daemon of chatDaemons) {
            if (idea.text.toLowerCase().includes(daemon.config.name.toLowerCase())) {
              daemonExplicitlyMentioned = true;
              const currentIdeaIndex = currentIdeas.findIndex(i => i.id === idea.id);
              const newPastIdeas = [...pastIdeas, ...currentIdeas.slice(0, currentIdeaIndex)];
              let lastCommentColumn = mostRecentComment ? mostRecentComment.daemonType : '';
              let column = lastCommentColumn === 'left' ? 'right' : 'left';
              await dispatchComment(newPastIdeas, idea, daemon, column);
              return;
            }
          }
        }
      }

      // Handle unprompted comments
      if (!daemonExplicitlyMentioned && currentIdeas.length >= minCurrentIdeas) {
        if (chatDaemonActive) {
          console.log('Chat daemon already active');
        }
        else {

          // randomly select a chat daemon
          const chatDaemon = chatDaemons[Math.floor(Math.random() * chatDaemons.length)];
          if (chatDaemon) {
            const currentIdea = await selectCurrentIdea(pastIdeas, currentIdeas, chatDaemon);

            if (currentIdea) {
              const currentIdeaIndex = currentIdeas.findIndex(idea => idea.id === currentIdea.id);
              const newPastIdeas = [...pastIdeas, ...currentIdeas.slice(0, currentIdeaIndex)];

              let lastCommentColumn = mostRecentComment ? mostRecentComment.daemonType : '';
              let column = lastCommentColumn === 'left' ? 'right' : 'left';

              dispatchComment(newPastIdeas, currentIdea, chatDaemon, column);
            }
          }
        }
      }
    }
  }, [currentIdeas,
    chatDaemons,
    pastIdeas,
    chatDaemonActive,
    openAIKey,
    minCurrentIdeas,
    mostRecentComment,
    dispatchComment,
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