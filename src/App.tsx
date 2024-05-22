import './app.css'
import TreeView from './components/views/Tree/TreeView';
import DaemonManager from './components/DaemonManager';
import Synchronizer from './components/Synchronizer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CollectionView from './components/views/Collection/CollectionView';
import { useAppSelector } from './hooks';

function App() {
  const darkThemeActive = useAppSelector(statae => statae.ui.darkTheme)

  return (
    <BrowserRouter>
      <div className={`App ${darkThemeActive ? 'dark-theme' : ''}`} >
        <Routes>
          <Route path="/" element={<TreeView />} />
          <Route path="/tree/:treeId" element={<TreeView />} />
          <Route path="/collection" element={<CollectionView />} />
        </Routes>
        <DaemonManager />
        <Synchronizer />
      </div>
    </BrowserRouter>
  );
}

export default App;
