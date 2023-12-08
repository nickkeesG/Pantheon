import { useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { TextState, 
         selectRecentIdeasWithoutComments,
         selectIdeasUpToMaxCommented,
         selectCommentsByIdeaId} from '../redux/contentSlice';
import { addComment} from '../redux/contentSlice';

import ChatDaemon from '../daemons/ChatDaemon';
import BaseDaemon from '../daemons/BaseDaemon';
import defaultDaemonList from '../daemons/DefaultDaemonList';

const DaemonManager = () => {
  const dispatch = useDispatch();
  const lastTimeActive = useSelector((state: TextState) => state.lastTimeActive);

  const [hasBeenInactive, setHasBeenInactive] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  
  const currentIdeas = useSelector((state: TextState) => selectRecentIdeasWithoutComments(state));
  const pastIdeas = useSelector((state: TextState) => selectIdeasUpToMaxCommented(state));
  const commentsForPastIdeas = useSelector((state: TextState) => getCommentsForPastIdeas(pastIdeas, state));

  const openaiKey = useSelector((state: TextState) => state.openaiKey);
  const openaiOrgId = useSelector((state: TextState) => state.openaiOrgId);

  const dispatchChatComment = async (pastIdeas: any, currentIdeas: any, daemon: ChatDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, openaiKey, openaiOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.name, daemonType: "chat"}));
    setIsCommenting(false);
  }

  const dispatchBaseComment = async (pastIdeas: any, currentIdeas: any, commentsForPastIdeas: any, daemon: BaseDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, commentsForPastIdeas, openaiKey, openaiOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.name, daemonType: "base"}));
    setIsCommenting(false);
  }

  const getCommentsForPastIdeas = (pastIdeas: any[], state: TextState) => {
    return pastIdeas.reduce((acc, idea) => {
      // Use the selector to get comments for each past idea
      const comments = selectCommentsByIdeaId(state, idea.id);
      acc[idea.id] = comments;
      return acc;
    }, {} as Record<number, Comment[]>);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 5 && !hasBeenInactive && !isCommenting) {
        console.log('User inactive');
        setHasBeenInactive(true);
        

        // Make new comments
        if (currentIdeas.length > 0 && openaiKey && openaiOrgId) {
          setIsCommenting(true);

          // Chat Daemons
          const randomDaemon = defaultDaemonList[Math.floor(Math.random() * defaultDaemonList.length)];
          dispatchChatComment(pastIdeas, currentIdeas, randomDaemon);

          // Base Daemons
          const baseDaemon = new BaseDaemon();
          dispatchBaseComment(pastIdeas, currentIdeas, commentsForPastIdeas, baseDaemon);
        }
      }

      if (secondsSinceLastActive < 5 && hasBeenInactive) {
        console.log('User active');
        setHasBeenInactive(false);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive, currentIdeas, dispatch]);

  return null;
}

export default DaemonManager;