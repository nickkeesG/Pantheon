import BaseDaemon from '../daemons/BaseDaemon';
import { useEffect, useState } from 'react';
import { selectRecentIdeasWithoutComments, selectIdeasUpToMaxCommented, selectCommentsByIdeaId, addComment } from '../redux/textSlice';
import ChatDaemon from '../daemons/ChatDaemon';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../redux/store';

const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.text.lastTimeActive);
  const [hasBeenInactive, setHasBeenInactive] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const chatDaemonConfigs = useAppSelector(state => state.daemon.chatDaemons)
  const [chatDaemons, setChatDaemons] = useState<ChatDaemon[]>([]);
  const currentIdeas = useAppSelector(selectRecentIdeasWithoutComments);
  const pastIdeas = useAppSelector(selectIdeasUpToMaxCommented);

  const openAIKey = useAppSelector(state => state.text.openAIKey);
  const openAIOrgId = useAppSelector(state => state.text.openAIOrgId);

  const getCommentsForPastIdeas = (pastIdeas: any[], state: RootState) => {
    return pastIdeas.reduce((acc, idea) => {
      // Use the selector to get comments for each past idea
      const comments = selectCommentsByIdeaId(state, idea.id);
      acc[idea.id] = comments;
      return acc;
    }, {} as Record<number, Comment[]>);
  };
  const commentsForPastIdeas: Record<number, any[]> = useAppSelector(state => getCommentsForPastIdeas(pastIdeas, state));

  const dispatchChatComment = async (pastIdeas: any, currentIdeas: any, daemon: ChatDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, openAIKey, openAIOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.config.name, daemonType: "chat" }));
    setIsCommenting(false);
  }

  const dispatchBaseComment = async (pastIdeas: any, currentIdeas: any, commentsForPastIdeas: any, daemon: BaseDaemon) => {
    const result = await daemon.generateComment(pastIdeas, currentIdeas, commentsForPastIdeas, openAIKey, openAIOrgId);
    const name = result.daemonName + " (base)";
    dispatch(addComment({ ideaId: result.id, text: result.content, daemonName: name, daemonType: "chat" })); //change daemon type when left column implemented
    setIsCommenting(false);
  }

  useEffect(() => {
    const daemons = chatDaemonConfigs.map(config => new ChatDaemon(config));
    setChatDaemons(daemons);
  }, [chatDaemonConfigs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 5 && !hasBeenInactive && !isCommenting) {
        console.log('User inactive');
        setHasBeenInactive(true);

        // Make new comments
        if (currentIdeas.length > 0 && openAIKey && openAIOrgId) {
          setIsCommenting(true);

          // Chat Daemons
          const randomDaemon = chatDaemons[Math.floor(Math.random() * chatDaemons.length)];
          dispatchChatComment(pastIdeas, currentIdeas, randomDaemon);

          // Base Daemons
          const baseDaemon = new BaseDaemon();
          const hasComments = Object.values(commentsForPastIdeas).some(commentsArray => commentsArray.length > 0);
          if (hasComments) {
            dispatchBaseComment(pastIdeas, currentIdeas, commentsForPastIdeas, baseDaemon);
          }
        }
      }

      if (secondsSinceLastActive < 5 && hasBeenInactive) {
        console.log('User active');
        setHasBeenInactive(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive, currentIdeas, dispatchChatComment, dispatchBaseComment]);

  return null;
}

export default DaemonManager;