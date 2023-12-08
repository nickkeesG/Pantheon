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
  const [isCommenting, setIsCommenting] = useState(false);

  
  const currentIdeas = useSelector((state: TextState) => selectRecentIdeasWithoutComments(state));
  const pastIdeas = useSelector((state: TextState) => selectIdeasUpToMaxCommented(state));

  const openAIKey = useSelector((state: TextState) => state.openAIKey);
  const openAIOrgId = useSelector((state: TextState) => state.openAIOrgId);

  const dispatchComment = async (pastIdeas: any, currentIdeas: any, daemon: ChatDaemon) => {
    const results = await daemon.generateComment(pastIdeas, currentIdeas, openAIKey, openAIOrgId);
    dispatch(addComment({ ideaId: results[0].id, text: results[0].content, daemonName: daemon.name}));
    setIsCommenting(false);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 5 && !hasBeenInactive && !isCommenting) {
        console.log('User inactive');
        setHasBeenInactive(true);
        

        // Make new comments
        if (currentIdeas.length > 0 && openAIKey && openAIOrgId) {
          setIsCommenting(true);
          const randomDaemon = defaultDaemonList[Math.floor(Math.random() * defaultDaemonList.length)];
          dispatchComment(pastIdeas, currentIdeas, randomDaemon);
        }
      }

      if (secondsSinceLastActive < 5 && hasBeenInactive) {
        console.log('User active');
        setHasBeenInactive(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive, currentIdeas, dispatchComment]);

  return null;
}

export default DaemonManager;