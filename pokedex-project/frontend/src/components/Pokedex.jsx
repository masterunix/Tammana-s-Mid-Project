import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit2 } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Pokedex({ addLog }) {
  const [pokemon, setPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPokeData, setNewPokeData] = useState({ name: '', type: 'Normal', level: 1 });

  const fetchPokemon = async () => {
    try {
      addLog('info', 'GET /api/pokemon - Fetching all Pokemon...');
      const res = await axios.get(`${API_URL}/pokemon`);
      setPokemon(res.data);
      addLog('success', `Success! Fetched ${res.data.length} Pokemon.`);
    } catch (error) {
      addLog('error', `Failed GET /api/pokemon - ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPokemon();
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      addLog('info', `GET /api/pokemon/search?q=${searchQuery} - Searching...`);
      const res = await axios.get(`${API_URL}/pokemon/search?q=${searchQuery}`);
      setPokemon(res.data);
      addLog('success', `Search complete. Found ${res.data.length} results.`);
    } catch (error) {
      addLog('error', `Failed GET /api/pokemon/search - ${error.message}`);
      // Fallback: Just try to fetch all if search fails
      fetchPokemon();
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
      addLog('info', `PUT /api/pokemon/${p.id} - Leveling up ${p.name}...`);
      await axios.put(`${API_URL}/pokemon/${p.id}`, { level: p.level + 1 });
      addLog('success', `Successfully leveled up ${p.name}!`);
      fetchPokemon();
    } catch (error) {
      addLog('error', `Failed PUT /api/pokemon/${p.id} - ${error.message}`);
    }
  };

  return (
    <div className="pokedex-main">
      <div className="pokedex-header">
        <h1 className="pokedex-title">National Pokedex</h1>
        <div className="controls">
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
