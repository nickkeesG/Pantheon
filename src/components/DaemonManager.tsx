import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Idea, Comment } from '../redux/models';
import { selectRecentIdeasWithoutComments, selectIdeasUpToMaxCommented } from '../redux/textSlice';
import { selectEnabledChatDaemons } from '../redux/daemonSlice';
import BaseDaemon from '../daemons/baseDaemon';
import ChatDaemon from '../daemons/chatDaemon';
import { dispatchError } from '../errorHandler';
import { addComment, selectCommentsGroupedByIdeaIds } from '../redux/commentSlice';

/*
Central controller for the deployment of daemons.
*/
const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.text.lastTimeActive);
  const [alreadyWasInactive, setAlreadyWasInactive] = useState(false);
  const [chatDaemonActive, setChatDaemonActive] = useState(false);
  const [baseDaemonActive, setBaseDaemonActive] = useState(false);
  const chatDaemonConfigs = useAppSelector(selectEnabledChatDaemons);
  const baseDaemonConfig = useAppSelector(state => state.daemon.baseDaemon);
  const [chatDaemons, setChatDaemons] = useState<ChatDaemon[]>([]);
  const [baseDaemon, setBaseDaemon] = useState<BaseDaemon | null>(null);
  const currentIdeas = useAppSelector(selectRecentIdeasWithoutComments);
  const pastIdeas = useAppSelector(selectIdeasUpToMaxCommented);
  const pastIdeaIds = useMemo(() => pastIdeas.map(idea => idea.id), [pastIdeas]);
  const commentsForPastIdeas = useAppSelector(state => selectCommentsGroupedByIdeaIds(state, pastIdeaIds, 'chat'));

  const openAIKey = useAppSelector(state => state.llm.openAIKey);
  const openAIOrgId = useAppSelector(state => state.llm.openAIOrgId);
  const chatModel = useAppSelector(state => state.llm.chatModel);
  const baseModel = useAppSelector(state => state.llm.baseModel);

  const maxTimeInactive = 5; // seconds

  useEffect(() => {
    const daemon = baseDaemonConfig ? new BaseDaemon(baseDaemonConfig) : null;
    setBaseDaemon(daemon);
  }, [baseDaemonConfig]);

  useEffect(() => {
    const daemons = chatDaemonConfigs.map(config => new ChatDaemon(config));
    setChatDaemons(daemons);
  }, [chatDaemonConfigs]);

  /*
  Main daemon controller loop. Runs every 200ms.
  Dispatches daemons if the user has been inactive for maxTimeInactive seconds.
  */
  useEffect(() => {
    const dispatchChatComment = async (pastIdeas: Idea[], currentIdeas: Idea[], daemon: ChatDaemon) => {
      setChatDaemonActive(true);
      try {
        // Returns a list of comments
        const results = await daemon.generateComments(pastIdeas, currentIdeas, openAIKey, openAIOrgId, chatModel);

        if (results.length === 0) {
          console.log('No chat comments generated');
        }
        else {
          // Dispatch first comment only
          dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.config.name, daemonType: "chat" }));
        }

      } catch (error) {
        dispatchError('Failed to dispatch chat comment'); //send error to user
        console.error(error);
      } finally {
        setChatDaemonActive(false);
      }
    }

    const dispatchBaseComment = async (pastIdeas: Idea[], currentIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>, daemon: BaseDaemon) => {
      setBaseDaemonActive(true);
      try {
        // Returns a single comment
        const result = await daemon.generateComment(pastIdeas, currentIdeas, commentsForPastIdeas, openAIKey, openAIOrgId, baseModel);
        if (result) { // If result is null, result failed to parse
          dispatch(addComment({ ideaId: result.id, text: result.content, daemonName: result.daemonName, daemonType: "base" }));
        }
        else {
          console.log('No base comment generated');
        }
      } catch (error) {
        dispatchError('Failed to dispatch base comment'); //send error to user
        console.error(error);
      } finally {
        setBaseDaemonActive(false);
      }
    }

    /*
    Dispatch daemons if the user has been inactive for maxTimeInactive seconds.
    Don't dispatch if a daemon of the same type is already active.
    */
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > maxTimeInactive && !alreadyWasInactive) {
        console.log('User became inactive');
        setAlreadyWasInactive(true);

        if(!openAIKey) {
          dispatchError('OpenAI API key not set');
          return;
        }

        // Generate new comments
        if (currentIdeas.length > 0) {

          if (chatDaemonActive) {
            console.log('Chat daemon already active');
          }
          else {
            const randomDaemon = chatDaemons[Math.floor(Math.random() * chatDaemons.length)];
            dispatchChatComment(pastIdeas, currentIdeas, randomDaemon);
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
      }

      if (secondsSinceLastActive < maxTimeInactive && alreadyWasInactive) {
        console.log('User became active');
        setAlreadyWasInactive(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lastTimeActive,
    alreadyWasInactive,
    currentIdeas,
    chatDaemons,
    baseDaemon,
    pastIdeas,
    commentsForPastIdeas,
    chatDaemonActive,
    baseDaemonActive,
    openAIKey,
    openAIOrgId,
    chatModel,
    baseModel,
    dispatch]);

  return null;
}

export default DaemonManager;