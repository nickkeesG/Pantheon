import './app.css'
import Display from './components/Display';
import DaemonManager from './components/DaemonManager';
//import Synchronizer from './components/Synchronizer';

function App() {
  return (
    <div className='App'>
      <Display />
      <DaemonManager />
      {/* <Synchronizer /> */}
    </div>
  );
}

export default App;
