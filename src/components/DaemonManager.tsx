import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea, Comment } from '../redux/models';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';
import BaseDaemon from '../daemons/baseDaemon';
import ChatDaemon from '../daemons/chatDaemon';
import { dispatchError } from '../errorHandler';
import { addComment, selectCommentsGroupedByIdeaIds } from '../redux/commentSlice';
import { selectActiveIdeasEligibleForComments, selectActivePastIdeas } from '../redux/ideaSlice';
import { CallChatModel } from '../llmHandler';
import { distance } from 'fastest-levenshtein';

/*
Central controller for the deployment of daemons.
*/
const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.ui.lastTimeActive);
  const [alreadyWasInactive, setAlreadyWasInactive] = useState(false);
  const [chatDaemonActive, setChatDaemonActive] = useState(false);
  const [baseDaemonActive, setBaseDaemonActive] = useState(false);
  const chatDaemonConfigs = useAppSelector(selectEnabledChatDaemons);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [chatDaemons, setChatDaemons] = useState<ChatDaemon[]>([]);
  const [baseDaemon, setBaseDaemon] = useState<BaseDaemon | null>(null);
  const currentIdeas = useAppSelector(selectActiveIdeasEligibleForComments);
  const pastIdeas = useAppSelector(selectActivePastIdeas);
  const pastIdeaIds = useMemo(() => pastIdeas.map(idea => idea.id), [pastIdeas]);
  const commentsForPastIdeas = useAppSelector(state => selectCommentsGroupedByIdeaIds(state, pastIdeaIds, 'chat'));

  const openAIKey = useAppSelector(state => state.config.openAIKey);
  const openAIOrgId = useAppSelector(state => state.config.openAIOrgId);
  const chatModel = useAppSelector(state => state.config.chatModel);
  const baseModel = useAppSelector(state => state.config.baseModel);

  const maxTimeInactive = 5; // seconds

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

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


  const dispatchBaseComment = useCallback(async (pastIdeas: Idea[], currentIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>, daemon: BaseDaemon) => {
    setBaseDaemonActive(true);
    try {
      // Returns a single comment
      const result = await daemon.generateComment(pastIdeas, currentIdeas, commentsForPastIdeas, openAIKey, openAIOrgId, baseModel);
      if (result) { // If result is null, result failed to parse
        dispatch(addComment({ ideaId: result.id, text: result.content, daemonName: result.daemonName, daemonType: "base" }));
      }
      else {
        console.error('No base comment generated');
      }
    } catch (error) {
      dispatchError('Failed to dispatch base comment'); //send error to user
      console.error(error);
    } finally {
      setBaseDaemonActive(false);
    }
  }, [openAIKey, openAIOrgId, baseModel, dispatch]);

  const selectChatDaemon = useCallback(async (pastIdeas: Idea[], currentIdeas: Idea[]) => {
    const context = [...pastIdeas, ...currentIdeas].map(idea => idea.text).join('\n');
    const daemonDescriptions = chatDaemons.map(daemon => `${daemon.config.name}: ${daemon.config.description}`);

    const systemPrompt = `You are the DaemonManager. You have been designed to impartially select the most useful chat daemon for a given context.
    It is critical that your judgement is fair, and that you do not show preferential treatment to any particular chat daemon.`

    const prompt = `Given the following context:/n${context}\n\n` +
    `Here are the available chat daemons and their descriptions:\n` +
    `${daemonDescriptions.join('\n')}\n\n` +
    `Which chat daemon seems the most useful for this context? Please respond with the name of the chat daemon. Do not write any other text.`;
    
    let daemonName = await CallChatModel(systemPrompt, prompt, openAIKey, openAIOrgId, chatModel);
    daemonName = daemonName.trim();

    const daemon = chatDaemons.find(daemon => daemon.config.name === daemonName);
    if (!daemon) {
      dispatchError(`Daemon Manager picked invalid daemon name: ${daemonName}`);
    }
    return daemon;

  }, [chatDaemons, openAIKey, openAIOrgId, chatModel]);

  const selectCurrentIdea = useCallback(async (pastIdeas: Idea[], currentIdeas: Idea[], daemon: ChatDaemon) => {
    const context = pastIdeas.map(idea => idea.text).join('\n');
    const currentIdeaText = currentIdeas.map(idea => idea.text).join('\n\n');

    const systemPrompt = daemon.config.description;
    const prompt = `Given the following past context: ${context}\n\n` +
    `Please select one of the following current ideas you would be most interested in discussing:\n${currentIdeaText}\n\n` +
    `Please write out the idea you want to respond to. Do not write any other text.`;

    let currentIdea = await CallChatModel(systemPrompt, prompt, openAIKey, openAIOrgId, chatModel);
    currentIdea = currentIdea.trim();

    // Find the idea with the smallest edit distance to the currentIdea
    const idea = currentIdeas.reduce((closestIdea, idea) => {
      const currentDistance = distance(currentIdea, idea.text);
      const closestDistance = closestIdea ? distance(currentIdea, closestIdea.text) : Infinity;

      return currentDistance < closestDistance ? idea : closestIdea;
    }, null as Idea | null);

    if (!idea) {
      dispatchError(`Daemon Manager picked invalid idea: ${currentIdea}`);
    }
    return idea;
  }, [openAIKey, openAIOrgId, chatModel]);


  const handleDaemonDispatch = useCallback(async() => {
    if(!openAIKey) {
      dispatchError('OpenAI API key not set');
      return;
    }

    if (currentIdeas.length > 0) {
      if (chatDaemonActive) {
        console.log('Chat daemon already active');
      }
      else {
        const chatDaemon = await selectChatDaemon(pastIdeas, currentIdeas);
        if (chatDaemon) {
          const currentIdea = await selectCurrentIdea(pastIdeas, currentIdeas, chatDaemon);

          if (currentIdea) {
            dispatchChatComment(pastIdeas, currentIdea, chatDaemon);
          }
        }
      }

      if (baseDaemonActive) {
        console.log('Base daemon already active');
      }
      else if (baseDaemon) {
        const hasComments = Object.values(commentsForPastIdeas).some(commentsArray => commentsArray.length > 0);
        if (hasComments) {
          dispatchBaseComment(pastIdeas, currentIdeas, commentsForPastIdeas, baseDaemon);
        }
        else {
          console.log('No comments for base daemon to emulate');
        }
      }
    }
  }, [currentIdeas,
    baseDaemon,
    pastIdeas,
    commentsForPastIdeas,
    chatDaemonActive,
    baseDaemonActive,
    openAIKey,
    dispatchBaseComment,
    dispatchChatComment,
    selectChatDaemon,
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