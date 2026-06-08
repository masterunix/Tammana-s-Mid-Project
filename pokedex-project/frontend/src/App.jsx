import React, { useState } from 'react';
import Terminal from './components/Terminal';
import Pokedex from './components/Pokedex';

function App() {
  const [logs, setLogs] = useState([]);

  const addLog = (type, message) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [{ type, message, time }, ...prev].slice(0, 50)); // Keep last 50
  };

  return (
    <div className="app-container">
      <Terminal logs={logs} />
      <Pokedex addLog={addLog} />
    </div>
  );
}

export default App;
