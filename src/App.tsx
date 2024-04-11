import './app.css'
import TreeView from './components/views/Tree/TreeView';
import DaemonManager from './components/DaemonManager';
import Synchronizer from './components/Synchronizer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CollectionView from './components/views/Collection/CollectionView';


function App() {
  return (
    <BrowserRouter>
      <div className='App'>
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
