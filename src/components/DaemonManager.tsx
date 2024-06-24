import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea } from '../redux/models';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';
import ChatDaemon from '../daemons/chatDaemon';
import { dispatchError } from '../errorHandler';
import { addComment, selectMostRecentCommentForCurrentBranch } from '../redux/commentSlice';
import { selectActiveThoughtsEligibleForComments, selectActiveThoughts } from '../redux/ideaSlice';


const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.ui.lastTimeActive);
  const [alreadyWasInactive, setAlreadyWasInactive] = useState(false);
  const [chatDaemonActive, setChatDaemonActive] = useState(false);
  const chatDaemonConfigs = useAppSelector(selectEnabledChatDaemons);
  const [chatDaemons, setChatDaemons] = useState<ChatDaemon[]>([]);
  const activeThoughts = useAppSelector(selectActiveThoughts);
  const ideasEligbleForComments = useAppSelector(selectActiveThoughtsEligibleForComments);
  const mostRecentComment = useAppSelector(selectMostRecentCommentForCurrentBranch);
  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const chatModel = useAppSelector(state => state.config.chatModel);
  const maxTimeInactive = 3; // seconds

  useEffect(() => {
    const daemons = chatDaemonConfigs.map(config => new ChatDaemon(config));
    setChatDaemons(daemons);
  }, [chatDaemonConfigs]);

  const dispatchChatComment = useCallback(async (pastIdeas: Idea[], currentIdea: Idea, daemon: ChatDaemon, column: string) => {
    setChatDaemonActive(true);
    try {
      // Returns a single comment
      const response = await daemon.generateComments(pastIdeas, currentIdea, openAIKey, openAIOrgId, chatModel);

      if (response) {
        dispatch(addComment({ ideaId: currentIdea.id, text: response.text, chainOfThought: response.chainOfThought, daemonName: daemon.config.name, daemonType: column }));
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
    // First try to find an idea with a mention
    const ideaWithMention = ideasEligbleForComments.find(idea => idea.mention);
    if (ideaWithMention) {
      return ideaWithMention;
    }

    // Ramdomly select an idea
    const randomIdea = ideasEligbleForComments[Math.floor(Math.random() * ideasEligbleForComments.length)];
    return randomIdea;
  }, []);


  const handleDaemonDispatch = useCallback(async () => {
    if (!openAIKey) {
      dispatchError('OpenAI API key not set');
      return;
    }

    if (ideasEligbleForComments.length > 0) {
      if (chatDaemonActive) {
        console.log('Chat daemon already active');
      }
      else {
        const currentIdea = await selectCurrentIdea(ideasEligbleForComments);
        let lastCommentColumn = mostRecentComment ? mostRecentComment.daemonType : '';
        const pastIdeas = activeThoughts.slice(0, activeThoughts.indexOf(currentIdea));

        // To maintain backwards compatibility with base/chat naming
        if (lastCommentColumn === 'base') { lastCommentColumn = 'left'; }
        if (lastCommentColumn === 'chat') { lastCommentColumn = 'right'; }

        const column = lastCommentColumn === 'left' ? 'right' : 'left';

        if (currentIdea.mention) {
          const mentionedDaemon = chatDaemons.find(daemon => daemon.config.name === currentIdea.mention);
          if (mentionedDaemon) {
            dispatchChatComment(pastIdeas, currentIdea, mentionedDaemon, column);
          }
        }
        else {
          // Randomly select daemon
          const daemon = chatDaemons[Math.floor(Math.random() * chatDaemons.length)];
          dispatchChatComment(pastIdeas, currentIdea, daemon, column);
        }
      }
    }
  }, [ideasEligbleForComments,
    activeThoughts,
    chatDaemonActive,
    chatDaemons,
    openAIKey,
    mostRecentComment,
    dispatchChatComment,
    selectCurrentIdea]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > maxTimeInactive && !alreadyWasInactive) {
        setAlreadyWasInactive(true);
        handleDaemonDispatch();
      }
      if (secondsSinceLastActive < maxTimeInactive && alreadyWasInactive) {
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