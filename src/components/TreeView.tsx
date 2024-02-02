import InputBox from './InputBox';
import HistoryContainer from './HistoryContainer';
import TopBar from './TopBar';
import ErrorDisplay from '../errorHandler';
// import WelcomeMessage from './WelcomeMessage';
import { ContainerVertical } from '../styles/sharedStyles';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { useEffect } from 'react';
import { openTree } from '../redux/thunks';


const TreeView = () => {
  const { treeId } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (treeId) {
      dispatch(openTree(parseInt(treeId)));
    }
  }, [dispatch, treeId]);

  // TODO Make WelcomeMesage show up only on first time opening the app
  return (
    <ContainerVertical>
      <TopBar />
      <HistoryContainer />
      <InputBox />
      <ErrorDisplay />
      {/* <WelcomeMessage /> */}
    </ContainerVertical>
  );
}

export default TreeView;