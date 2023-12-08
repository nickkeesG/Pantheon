import BaseDaemon from '../daemons/BaseDaemon';
import { useEffect, useState } from 'react';
import { selectRecentIdeasWithoutComments, selectIdeasUpToMaxCommented, addComment, selectCommentsGroupedByIdea, Idea, Comment } from '../redux/textSlice';
import ChatDaemon from '../daemons/ChatDaemon';
import { useAppDispatch, useAppSelector } from '../hooks';

const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.text.lastTimeActive);
  const [hasBeenInactive, setHasBeenInactive] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const chatDaemonConfigs = useAppSelector(state => state.daemon.chatDaemons)
  const [chatDaemons, setChatDaemons] = useState<ChatDaemon[]>([]);
  const currentIdeas = useAppSelector(selectRecentIdeasWithoutComments);
  const pastIdeas = useAppSelector(selectIdeasUpToMaxCommented);
  const commentsForPastIdeas = useAppSelector(selectCommentsGroupedByIdea)

  const openAIKey = useAppSelector(state => state.text.openAIKey);
  const openAIOrgId = useAppSelector(state => state.text.openAIOrgId);

  const dispatchChatComment = async (pastIdeas: Idea[], currentIdeas: Idea[], daemon: ChatDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, openAIKey, openAIOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.config.name, daemonType: "chat" }));
    setIsCommenting(false);
  }

  const dispatchBaseComment = async (pastIdeas: Idea[], currentIdeas: Idea[], commentsForPastIdeas: Record<number, Comment[]>, daemon: BaseDaemon) => {
    const result = await daemon.generateComment(pastIdeas, currentIdeas, commentsForPastIdeas, openAIKey, openAIOrgId);
    if (result) {
      dispatch(addComment({ ideaId: result.id, text: result.content, daemonName: result.daemonName, daemonType: "base" }));
    }
    setIsCommenting(false);
  }

  useEffect(() => {
    const daemons = chatDaemonConfigs.map(config => new ChatDaemon(config));
    setChatDaemons(daemons);
  }, [chatDaemonConfigs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 2 && !hasBeenInactive && !isCommenting) {
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

      if (secondsSinceLastActive < 2 && hasBeenInactive) {
        console.log('User active');
        setHasBeenInactive(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive, currentIdeas, dispatchChatComment, dispatchBaseComment]);

  return null;
}

export default DaemonManager;