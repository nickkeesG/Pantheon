import './app.css'
import TreeView from './components/views/Tree/TreeView';
import DaemonManager from './components/DaemonManager';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CollectionView from './components/views/Collection/CollectionView';
import { useAppSelector } from './hooks';
import { useCallback, useEffect } from 'react';
import { Filler } from './styles/sharedStyles';
import { ModalProvider } from './components/ModalContext';
import LandingView from './components/views/Landing/LandingView';
import { FaGithub } from 'react-icons/fa';

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

  return (
    <BrowserRouter>
      <div className={`App`} >
        <ModalProvider>
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/tree/:treeId" element={<TreeView />} />
            <Route path="/collection" element={<CollectionView />} />
          </Routes>
          <DaemonManager />
          <Filler />
          <footer>
            <p>
              Crafted by <a href="https://mosaic-labs.org" target="_blank" rel="noopener noreferrer">Mosaic Labs</a>
            </p>
            <a href="https://github.com/nickkeesG/Pantheon" target="_blank" rel="noopener noreferrer">
              <FaGithub className="github-icon" />
              Source
            </a>
          </footer>
        </ModalProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
