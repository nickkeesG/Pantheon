import { useEffect, useState} from 'react';
import { useSelector} from 'react-redux';
import { TextState } from '../redux/textSlice';

const DaemonManager = () => {
  const lastTimeActive = useSelector((state: TextState) => state.lastTimeActive);
  const [hasBeenInactive, setHasBeenInactive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastActive = (new Date().getTime() - new Date(lastTimeActive).getTime()) / 1000;
      if (secondsSinceLastActive > 2 && !hasBeenInactive) {
        console.log('User inactive');
        setHasBeenInactive(true);
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