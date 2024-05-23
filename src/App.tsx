import './app.css'
import TreeView from './components/views/Tree/TreeView';
import DaemonManager from './components/DaemonManager';
import Synchronizer from './components/Synchronizer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CollectionView from './components/views/Collection/CollectionView';
import { useAppSelector } from './hooks';
import { useEffect, useState } from 'react';

function App() {
  const configTheme = useAppSelector(state => state.config.theme);
  const [cssTheme, setCssTheme] = useState(configTheme?.toString());

  useEffect(() => {
    if (configTheme === 'system') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const setTheme = (e: MediaQueryListEvent) => {
        setCssTheme(e.matches ? 'dark' : 'light');
      };

      setCssTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
      darkModeMediaQuery.addEventListener('change', setTheme);

      return () => {
        darkModeMediaQuery.removeEventListener('change', setTheme);
      };
    } else {
      setCssTheme(configTheme?.toString());
    }
  }, [configTheme]);

  return (
    <BrowserRouter>
      <div className={`App ${cssTheme}`} >
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
