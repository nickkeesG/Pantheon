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

  const dispatchComment = async (ideaId: number, daemon: ChatDaemon) => {
    const comment = await daemon.generateComment(ideaId);
    dispatch(addComment({ ideaId, text: comment }));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 2 && !hasBeenInactive) {
        console.log('User inactive');
        setHasBeenInactive(true);

        // Make new comments
        if (currentIdeas.length > 0) {
          for (let i = 0; i < currentIdeas.length; i++) {
            // Randomly select a daemon
            const randomDaemon = defaultDaemonList[Math.floor(Math.random() * defaultDaemonList.length)];
            dispatchComment(currentIdeas[i].id, randomDaemon);
          }
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