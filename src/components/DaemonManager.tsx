import { useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { TextState, selectRecentIdeasWithoutComments, selectIdeasUpToMaxCommented} from '../redux/contentSlice';
import { addComment} from '../redux/contentSlice';

import ChatDaemon from '../daemons/ChatDaemon';
import defaultDaemonList from '../daemons/DefaultDaemonList';

const DaemonManager = () => {
  const dispatch = useDispatch();
  const lastTimeActive = useSelector((state: TextState) => state.lastTimeActive);
  const [hasBeenInactive, setHasBeenInactive] = useState(false);
  
  const currentIdeas = useSelector((state: TextState) => selectRecentIdeasWithoutComments(state));
  const pastIdeas = useSelector((state: TextState) => selectIdeasUpToMaxCommented(state));

  const openaiKey = useSelector((state: TextState) => state.openaiKey);
  const openaiOrgId = useSelector((state: TextState) => state.openaiOrgId);

  const dispatchComment = async (pastIdeas: any, currentIdeas: any, daemon: ChatDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, openaiKey, openaiOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.name}));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 2 && !hasBeenInactive) {
        console.log('User inactive');
        setHasBeenInactive(true);

        // Make new comments
        if (currentIdeas.length > 0 && openaiKey && openaiOrgId) {
          const randomDaemon = defaultDaemonList[Math.floor(Math.random() * defaultDaemonList.length)];
          dispatchComment(pastIdeas, currentIdeas, randomDaemon);
        }
      }

      if (secondsSinceLastActive < 2 && hasBeenInactive) {
        console.log('User active');
        setHasBeenInactive(false);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive, currentIdeas, dispatch]);

  return null;
}

export default DaemonManager;