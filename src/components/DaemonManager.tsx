import { useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { TextState } from '../redux/contentSlice';
import { addComment} from '../redux/contentSlice';

const DaemonManager = () => {
  const dispatch = useDispatch();
  const lastTimeActive = useSelector((state: TextState) => state.lastTimeActive);
  const ideas = useSelector((state: TextState) => state.ideas);
  const [hasBeenInactive, setHasBeenInactive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 2 && !hasBeenInactive) {
        console.log('User inactive');
        setHasBeenInactive(true);

        // Make new comment 
        if (ideas.length > 0) {
          var lastIdeaId = ideas[ideas.length - 1].id;
          dispatch(addComment({ideaId: lastIdeaId, text: 'I see you have been inactive for a while. What are you thinking about?'}));
        }
      }

      if (secondsSinceLastActive < 2 && hasBeenInactive) {
        console.log('User active');
        setHasBeenInactive(false);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [lastTimeActive, hasBeenInactive]);

  return null;
}

export default DaemonManager;