import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal as TerminalIcon, CheckCircle, XCircle, Clock } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const TESTS = [
  { id: 1, name: "Task 1: Server Boot", endpoint: () => axios.get(`${API_URL}/health`).catch(e => { if(e.message === 'Network Error') throw e; return e; }) },
  { id: 2, name: "Task 2: CORS Middleware", endpoint: () => axios.get(`${API_URL}/health`) },
  { id: 3, name: "Task 3: JSON Parser", endpoint: () => axios.post(`${API_URL}/pokemon`, {}, { validateStatus: () => true }).then(res => { if(res.status === 404 || res.status === 500) throw new Error('Not parsed'); return res; }) },
  { id: 4, name: "Task 4: Health Route", endpoint: () => axios.get(`${API_URL}/health`).then(r => r.data.status === 'ok' ? r : Promise.reject('Bad data')) },
  { id: 5, name: "Task 5: Static Files", endpoint: () => axios.get('http://localhost:3001/images/pikachu.png') },
  { id: 6, name: "Task 6: Get All (/pokemon)", endpoint: () => axios.get(`${API_URL}/pokemon`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
  { id: 7, name: "Task 7: Get by ID (/pokemon/:id)", endpoint: () => axios.get(`${API_URL}/pokemon/1`).then(r => r.data.id === 1 ? r : Promise.reject('Wrong ID')) },
  { id: 8, name: "Task 8: Search (?q=)", endpoint: () => axios.get(`${API_URL}/pokemon/search?q=chu`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
  { id: 9, name: "Task 9: Filter by Type", endpoint: () => axios.get(`${API_URL}/pokemon/type/electric`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
  { id: 10, name: "Task 10: Pagination (?limit=)", endpoint: () => axios.get(`${API_URL}/pokemon?limit=1`).then(r => r.data.length === 1 ? r : Promise.reject('Length not 1')) },
  { id: 11, name: "Task 11: Create New (POST)", endpoint: () => axios.post(`${API_URL}/pokemon`, { name: "TestMon" }) },
  { id: 12, name: "Task 12: Validation (400)", endpoint: () => axios.post(`${API_URL}/pokemon`, {}).then(r => Promise.reject('Should fail')).catch(e => e.response?.status === 400 ? e : Promise.reject('Wrong status')) },
  { id: 13, name: "Task 13: Update (PUT)", endpoint: () => axios.put(`${API_URL}/pokemon/1`, { level: 99 }) },
  { id: 14, name: "Task 14: Delete (DELETE)", endpoint: () => axios.delete(`${API_URL}/pokemon/1`, { validateStatus: s => s === 200 || s === 404 }) },
  { id: 15, name: "Task 15: 404 Handler", endpoint: () => axios.get(`${API_URL}/this-route-does-not-exist`).then(r => Promise.reject('Should 404')).catch(e => e.response?.status === 404 ? e : Promise.reject('Wrong status')) },
];

export default function Terminal({ logs }) {
  const [testResults, setTestResults] = useState(
    TESTS.map(t => ({ ...t, status: 'pending' }))
  );

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = [...testResults];
      for (let i = 0; i < TESTS.length; i++) {
        try {
          await TESTS[i].endpoint();
          results[i].status = 'passed';
        } catch (error) {
          results[i].status = 'failed';
        }
        setTestResults([...results]);
      }
    };

    const interval = setInterval(runDiagnostics, 5000);
    runDiagnostics(); // Run immediately

    return () => clearInterval(interval);
  }, []);

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const totalTests = TESTS.length;
  const progressPercent = (passedCount / totalTests) * 100;

  return (
    <div className="terminal-sidebar">
      <div className="terminal-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TerminalIcon size={18} /> API Diagnostics
        </h2>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          Tasks Completed: {passedCount} / {totalTests}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      
      <div className="terminal-body">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Live Test Results</h3>
        <div style={{ marginBottom: '2rem' }}>
          {testResults.map(test => (
            <div key={test.id} className={`test-item test-status ${test.status}`}>
              <span>{test.name}</span>
              {test.status === 'passed' && <CheckCircle size={16} />}
              {test.status === 'failed' && <XCircle size={16} />}
              {test.status === 'pending' && <Clock size={16} />}
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Action Logs</h3>
        {logs.length === 0 && <div style={{ color: '#666', fontStyle: 'italic' }}>Waiting for actions...</div>}
        {logs.map((log, i) => (
          <div key={i} className={`log-entry log-${log.type}`}>
            <span className="log-time">[{log.time}]</span>
            {log.message}
          </div>
        ))}
      </div>
    </div>
  );
}
