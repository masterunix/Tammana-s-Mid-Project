import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, ShieldAlert } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Pokedex({ addLog }) {
  const [pokemon, setPokemon] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPokeData, setNewPokeData] = useState({ name: '', type: 'Normal', level: 1 });

  const LIMIT = 10;

  const fetchPokemon = async () => {
    try {
      addLog('info', `GET /api/pokemon?limit=${LIMIT}&skip=${page * LIMIT}${sortOption ? `&sort=${sortOption}` : ''} - Fetching...`);
      
      let url = `${API_URL}/pokemon?limit=${LIMIT}&skip=${page * LIMIT}`;
      if (sortOption) url += `&sort=${sortOption}`;
      
      const res = await axios.get(url);
      setPokemon(res.data);
      addLog('success', `Success! Fetched ${res.data.length} Pokemon.`);
      
      // Also try to fetch total count
      try {
        const countRes = await axios.get(`${API_URL}/pokemon/count`);
        if (countRes.data && countRes.data.total !== undefined) {
          setTotalCount(countRes.data.total);
        }
      } catch (e) {
        // Ignore count error
      }
    } catch (error) {
      addLog('error', `Failed GET /api/pokemon - ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPokemon();
    // eslint-disable-next-line
  }, [sortOption, page]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!searchQuery) {
        setPage(0);
        return fetchPokemon();
      }
      addLog('info', `GET /api/pokemon/search?q=${searchQuery} - Searching...`);
      const res = await axios.get(`${API_URL}/pokemon/search?q=${searchQuery}`);
      setPokemon(res.data);
      addLog('success', `Search complete. Found ${res.data.length} results.`);
    } catch (error) {
      addLog('error', `Failed GET /api/pokemon/search - ${error.message}`);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      addLog('info', `POST /api/pokemon - Adding ${newPokeData.name}...`);
      await axios.post(`${API_URL}/pokemon`, newPokeData);
      addLog('success', `Successfully added ${newPokeData.name}!`);
      setIsModalOpen(false);
      setNewPokeData({ name: '', type: 'Normal', level: 1 });
      fetchPokemon();
    } catch (error) {
      addLog('error', `Failed POST /api/pokemon - ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      addLog('info', `DELETE /api/pokemon/${id} - Deleting ${name}...`);
      await axios.delete(`${API_URL}/pokemon/${id}`);
      addLog('success', `Successfully deleted ${name}!`);
      fetchPokemon();
    } catch (error) {
      addLog('error', `Failed DELETE /api/pokemon/${id} - ${error.message}`);
    }
  };

  const handleLevelUp = async (p) => {
    try {
      // Changed to use PATCH as per the new Task 21
      addLog('info', `PATCH /api/pokemon/${p.id}/level - Leveling up ${p.name}...`);
      await axios.patch(`${API_URL}/pokemon/${p.id}/level`, { level: p.level + 1 });
      addLog('success', `Successfully leveled up ${p.name}!`);
      fetchPokemon();
    } catch (error) {
      addLog('error', `Failed PATCH /api/pokemon/${p.id}/level - ${error.response?.data?.error || error.message}`);
    }
  };

  const triggerGlobalError = async () => {
    try {
      addLog('info', `GET /api/error - Triggering 500 error...`);
      await axios.get(`${API_URL}/error`);
    } catch (error) {
      addLog('error', `Received expected error - ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="pokedex-main">
      <div className="pokedex-header">
        <div>
          <h1 className="pokedex-title">National Pokedex</h1>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Total Pokemon in DB: {totalCount > 0 ? totalCount : '??'}
          </div>
        </div>
        
        <div className="controls">
          <select 
            className="search-input" 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sort: Default</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="level">Sort: Highest Level</option>
          </select>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search Pokemon..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} />
            </button>
          </form>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      <div className="pokemon-grid">
        {pokemon.length === 0 ? (
          <div style={{ color: '#666', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            No Pokemon found. Check the terminal for errors!
          </div>
        ) : (
          pokemon.map(p => (
            <div key={p.id} className="pokemon-card">
              <img 
                src={`http://localhost:3001/images/${p.image || 'default.png'}`} 
                alt={p.name} 
                className="pokemon-image"
                onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png' }}
              />
              <div className="pokemon-name">{p.name}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="pokemon-type">{p.type}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Lvl {p.level}</span>
              </div>
              
              <div className="pokemon-actions">
                <button className="btn" onClick={() => handleLevelUp(p)}>Level Up</button>
                <button className="btn btn-danger" onClick={() => handleDelete(p.id, p.name)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="btn" 
          disabled={page === 0} 
          onClick={() => setPage(p => Math.max(0, p - 1))}
        >
          Previous Page
        </button>
        
        <button className="btn btn-danger" onClick={triggerGlobalError} style={{ opacity: 0.5 }}>
          Test 500 Error
        </button>

        <button 
          className="btn" 
          disabled={pokemon.length < LIMIT}
          onClick={() => setPage(p => p + 1)}
        >
          Next Page
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Pokemon</h3>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Name (Required)</label>
                <input 
                  type="text" 
                  value={newPokeData.name} 
                  onChange={e => setNewPokeData({...newPokeData, name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input 
                  type="text" 
                  value={newPokeData.type} 
                  onChange={e => setNewPokeData({...newPokeData, type: e.target.value})} 
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
