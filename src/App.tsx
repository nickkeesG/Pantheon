import './app.css'
import TreeView from './components/views/Tree/TreeView';
import DaemonManager from './components/DaemonManager';
import Synchronizer from './components/Synchronizer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CollectionView from './components/views/Collection/CollectionView';
import { useAppSelector } from './hooks';
import { useCallback, useEffect } from 'react';
import { Filler } from './styles/sharedStyles';

function App() {
  const configTheme = useAppSelector(state => state.config.theme);

  const setTheme = useCallback((dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (configTheme === 'system' || configTheme === undefined) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(darkModeMediaQuery.matches);
      darkModeMediaQuery.addEventListener('change', (e) => setTheme(e.matches));
      return () => {
        darkModeMediaQuery.removeEventListener('change', (e) => setTheme(e.matches));
      };
    } else {
      setTheme(configTheme === 'dark');
    }
  }, [configTheme, setTheme]);

  // TODO Uncomment the GitHub link once we've opened the repo
  return (
    <BrowserRouter>
      <div className={`App`} >
        <Routes>
          <Route path="/" element={<TreeView />} />
          <Route path="/tree/:treeId" element={<TreeView />} />
          <Route path="/collection" element={<CollectionView />} />
        </Routes>
        <DaemonManager />
        <Synchronizer />
        <Filler />
        <footer>
          <p>
            © {new Date().getFullYear()} Niki Kees Dupuis and Sofia Vanhanen. Licensed under the GNU GPLv3.
            <br />
            {/* Contribute to this project on <a href="https://github.com/nickkeesG/Pantheon">GitHub</a>. */}
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
