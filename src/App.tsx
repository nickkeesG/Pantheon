import React from 'react';
import './app.css'
import Display from './components/Display';
import DaemonManager from './components/DaemonManager';

function App() {
  return (
    <div className='App'>
      <Display />
      <DaemonManager />
    </div>
  );
}

export default App;
