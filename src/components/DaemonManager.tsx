import { useEffect, useState} from 'react';
import { selectRecentIdeasWithoutComments,
         selectIdeasUpToMaxCommented,
         selectCommentsByIdeaId} from '../redux/textSlice';
import { addComment} from '../redux/textSlice';

import ChatDaemon from '../daemons/ChatDaemon';
import BaseDaemon from '../daemons/BaseDaemon';
import defaultDaemonList from '../daemons/DefaultDaemonList';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../redux/store';

const DaemonManager = () => {
  const dispatch = useAppDispatch();
  const lastTimeActive = useAppSelector(state => state.text.lastTimeActive);

  const [hasBeenInactive, setHasBeenInactive] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const getCommentsForPastIdeas = (pastIdeas: any[], state: RootState) => {
    return pastIdeas.reduce((acc, idea) => {
      // Use the selector to get comments for each past idea
      const comments = selectCommentsByIdeaId(state, idea.id, "chat");
      acc[idea.id] = comments;
      return acc;
    }, {} as Record<number, Comment[]>);
  };
  
  const currentIdeas = useAppSelector(selectRecentIdeasWithoutComments);
  const pastIdeas = useAppSelector(selectIdeasUpToMaxCommented);
  const commentsForPastIdeas: Record<number, any[]> = useAppSelector((state: RootState) => getCommentsForPastIdeas(pastIdeas, state));

  const openAIKey = useAppSelector(state => state.text.openAIKey);
  const openAIOrgId = useAppSelector(state => state.text.openAIOrgId);

  const dispatchChatComment = async (pastIdeas: any, currentIdeas: any, daemon: ChatDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, openAIKey, openAIOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.name, daemonType: "chat"}));
    setIsCommenting(false);
  }

  const dispatchBaseComment = async (pastIdeas: any, currentIdeas: any, commentsForPastIdeas: any, daemon: BaseDaemon) => {
    const result = await daemon.generateComment(pastIdeas, currentIdeas, commentsForPastIdeas, openAIKey, openAIOrgId);
    if (result) {
      dispatch(addComment({ ideaId: result.id, text: result.content, daemonName: result.daemonName, daemonType: "base"}));
    }
    setIsCommenting(false);
  }

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
          const randomDaemon = defaultDaemonList[Math.floor(Math.random() * defaultDaemonList.length)];
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
    }, 1000);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive, currentIdeas, dispatchChatComment, dispatchBaseComment]);

  return null;
}

export default DaemonManager;