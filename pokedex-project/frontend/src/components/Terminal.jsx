import React, { useState } from 'react';
import axios from 'axios';
import { Terminal as TerminalIcon, CheckCircle, XCircle, Clock, Play, PlayCircle } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const getFirstId = async () => {
  try {
    const res = await axios.get(`${API_URL}/pokemon`);
    if (res.data && res.data.length > 0) return res.data[0].id;
  } catch(e) {}
  return 1; // Fallback
};

const TESTS = [
  { id: 1, name: "Task 1: Server Boot", endpoint: () => axios.get(`${API_URL}/health`).catch(e => { if(e.message === 'Network Error') throw e; return e; }) },
  { id: 2, name: "Task 2: CORS Middleware", endpoint: () => axios.get(`${API_URL}/health`) },
  { id: 3, name: "Task 3: JSON Parser", endpoint: () => axios.post(`${API_URL}/pokemon`, {}, { validateStatus: () => true }).then(res => { if(res.status === 404 || res.status === 500) throw new Error('Not parsed'); return res; }) },
  { id: 4, name: "Task 4: Health Route", endpoint: () => axios.get(`${API_URL}/health`).then(r => r.data.status === 'ok' ? r : Promise.reject('Bad data')) },
  { id: 5, name: "Task 5: Static Files", endpoint: () => axios.get('http://localhost:3001/images/pikachu.png') },
  { id: 6, name: "Task 6: Get All (/pokemon)", endpoint: () => axios.get(`${API_URL}/pokemon`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
  
  { id: 7, name: "Task 7: Get by ID (/pokemon/:id)", endpoint: async () => {
    const id = await getFirstId();
    return axios.get(`${API_URL}/pokemon/${id}`).then(r => r.data.id === id ? r : Promise.reject('Wrong ID'));
  }},
  
  { id: 8, name: "Task 8: Search (?q=)", endpoint: () => axios.get(`${API_URL}/pokemon/search?q=chu`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
  { id: 9, name: "Task 9: Filter by Type", endpoint: () => axios.get(`${API_URL}/pokemon/type/electric`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
  { id: 10, name: "Task 10: Pagination (limit)", endpoint: () => axios.get(`${API_URL}/pokemon?limit=1`).then(r => r.data.length === 1 ? r : Promise.reject('Length not 1')) },
  { id: 11, name: "Task 11: Create New (POST)", endpoint: () => axios.post(`${API_URL}/pokemon`, { name: "TestMon" }) },
  { id: 12, name: "Task 12: Validation (400)", endpoint: () => axios.post(`${API_URL}/pokemon`, {}).then(r => Promise.reject('Should fail')).catch(e => e.response?.status === 400 ? e : Promise.reject('Wrong status')) },
  
  { id: 13, name: "Task 13: Update (PUT)", endpoint: async () => {
    const id = await getFirstId();
    return axios.put(`${API_URL}/pokemon/${id}`, { name: "UpdatedName", level: 99 });
  }},
  
  { id: 14, name: "Task 14: Delete (DELETE)", endpoint: async () => {
    // Create a dummy one just to delete it, to preserve real data!
    try {
      const created = await axios.post(`${API_URL}/pokemon`, { name: "DeleteMe" });
      return axios.delete(`${API_URL}/pokemon/${created.data.id}`);
    } catch (e) {
      // If POST fails, fallback to expecting a 404 on a fake ID to prove route exists
      return axios.delete(`${API_URL}/pokemon/99999`).catch(err => err.response?.status === 404 ? err : Promise.reject());
    }
  }},
  
  { id: 15, name: "Task 15: 404 Handler", endpoint: () => axios.get(`${API_URL}/this-route-does-not-exist`).then(r => Promise.reject('Should 404')).catch(e => e.response?.status === 404 ? e : Promise.reject('Wrong status')) },
  { id: 16, name: "Task 16: 500 Error Handler", endpoint: () => axios.get(`${API_URL}/error`).then(r => Promise.reject('Should 500')).catch(e => e.response?.status === 500 ? e : Promise.reject('No 500')) },
  { id: 17, name: "Task 17: Get Total Count", endpoint: () => axios.get(`${API_URL}/pokemon/count`).then(r => r.data.total !== undefined ? r : Promise.reject('No total field')) },
  { id: 18, name: "Task 18: Sort by Name", endpoint: () => axios.get(`${API_URL}/pokemon?sort=name`).then(r => r.data.length > 0 ? r : Promise.reject('Fails')) },
  { id: 19, name: "Task 19: Sort by Level", endpoint: () => axios.get(`${API_URL}/pokemon?sort=level`).then(r => r.data.length > 0 ? r : Promise.reject('Fails')) },
  { id: 20, name: "Task 20: Pagination (skip)", endpoint: () => axios.get(`${API_URL}/pokemon?limit=1&skip=1`).then(r => r.data.length === 1 ? r : Promise.reject('Length not 1')) },
  
  { id: 21, name: "Task 21: PATCH Level", endpoint: async () => {
    const id = await getFirstId();
    return axios.patch(`${API_URL}/pokemon/${id}/level`, { level: 10 });
  }},
  
  { id: 22, name: "Task 22: PATCH Name", endpoint: async () => {
    const id = await getFirstId();
    return axios.patch(`${API_URL}/pokemon/${id}/name`, { name: "PatchedName" });
  }},
  
  { id: 23, name: "Task 23: Update Validation", endpoint: async () => {
    const id = await getFirstId();
    return axios.patch(`${API_URL}/pokemon/${id}/level`, { level: -5 }).then(r => Promise.reject('Should fail')).catch(e => e.response?.status === 400 ? e : Promise.reject('Wrong status'));
  }},
  
  { id: 24, name: "Task 24: Get by Level", endpoint: () => axios.get(`${API_URL}/pokemon/level/5`).then(r => Array.isArray(r.data) ? r : Promise.reject('Not array')) },
];

export default function Terminal({ logs }) {
  const [testResults, setTestResults] = useState(
    TESTS.map(t => ({ ...t, status: 'pending' }))
  );
  const [isRunningAll, setIsRunningAll] = useState(false);

  const runTest = async (testId) => {
    const test = TESTS.find(t => t.id === testId);
    setTestResults(prev => prev.map(t => t.id === testId ? { ...t, status: 'running' } : t));
    
    try {
      await test.endpoint();
      setTestResults(prev => prev.map(t => t.id === testId ? { ...t, status: 'passed' } : t));
      return true;
    } catch (error) {
      setTestResults(prev => prev.map(t => t.id === testId ? { ...t, status: 'failed' } : t));
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    setTestResults(prev => prev.map(t => ({ ...t, status: 'pending' })));
    
    for (const test of TESTS) {
      await runTest(test.id);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsRunningAll(false);
  };

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const totalTests = TESTS.length;
  const progressPercent = (passedCount / totalTests) * 100;

  return (
    <div className="terminal-sidebar">
      <div className="terminal-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <TerminalIcon size={18} /> API Diagnostics
          </h2>
          <button 
            onClick={runAllTests} 
            disabled={isRunningAll}
            style={{ 
              background: '#3b82f6', border: 'none', color: '#fff', 
              padding: '4px 8px', borderRadius: '4px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem'
            }}
          >
            <PlayCircle size={14} /> {isRunningAll ? 'Running...' : 'Run All'}
          </button>
        </div>
        
        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          Tasks Completed: {passedCount} / {totalTests}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      
      <div className="terminal-body">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Manual Test Suite</h3>
        <div style={{ marginBottom: '2rem' }}>
          {testResults.map(test => (
            <div key={test.id} className={`test-item test-status ${test.status}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  onClick={() => runTest(test.id)} 
                  disabled={test.status === 'running' || isRunningAll}
                  style={{ 
                    background: 'transparent', border: '1px solid #444', color: '#fff', 
                    cursor: 'pointer', borderRadius: '4px', padding: '2px 4px', display: 'flex',
                    opacity: (test.status === 'running' || isRunningAll) ? 0.5 : 1
                  }}
                  title="Run this test"
                >
                  <Play size={12} />
                </button>
                <span style={{ opacity: test.status === 'pending' ? 0.7 : 1 }}>{test.name}</span>
              </div>
              
              {test.status === 'passed' && <CheckCircle size={16} />}
              {test.status === 'failed' && <XCircle size={16} />}
              {test.status === 'running' && <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Running...</span>}
              {test.status === 'pending' && <Clock size={16} style={{ opacity: 0.5 }} />}
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
