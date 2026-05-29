import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const API = '/api';

const emptyForm = {
  week_no: '',
  stock_no: '',
  name: '',
  year: new Date().getFullYear(),
  transmission: 'A/T',
  fuel: 'Gasoline',
  cc: '',
  km: 0,
  grade: '',
  color: '',
  price_usd: 0,
  link: '',
  image: '',
};

const Admin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [weekFilter, setWeekFilter] = useState('');
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const [syncWeek, setSyncWeek] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const authHeader = { Authorization: `Bearer ${token}` };

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    navigate('/auth');
  }, [navigate]);

  const fetchWeeks = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auctions/weeks`);
      setWeeks(data);
    } catch (err) {
      console.error('Failed to fetch weeks', err);
    }
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, activeOnly: 'false' };
      if (weekFilter) params.weekNo = weekFilter;
      const { data } = await axios.get(`${API}/auctions`, { params });
      setCars(data.data);
      setTotal(data.total);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  }, [page, weekFilter, logout]);

  useEffect(() => { fetchWeeks(); }, [fetchWeeks]);
  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auctions`, formData, { headers: authHeader });
      setIsFormOpen(false);
      setFormData(emptyForm);
      fetchCars();
      fetchWeeks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add car');
    }
  };

  const handleToggleStatus = async (car) => {
    try {
      await axios.patch(`${API}/auctions/${car.id}/status`, { is_active: !car.is_active }, { headers: authHeader });
      setCars(prev => prev.map(c => c.id === car.id ? { ...c, is_active: car.is_active ? 0 : 1 } : c));
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm(`Delete "${car.name}"?`)) return;
    try {
      await axios.delete(`${API}/auctions/${car.id}`, { headers: authHeader });
      fetchCars();
    } catch {
      alert('Failed to delete');
    }
  };

  const handleSync = async (e) => {
    e.preventDefault();
    if (!syncWeek) return;
    setSyncing(true);
    setSyncMsg('');
    try {
      const { data } = await axios.post(`${API}/auctions/sync`, { weekNo: parseInt(syncWeek) }, { headers: authHeader });
      setSyncMsg(`Done! Week ${syncWeek} → ${data.inserted} cars saved.`);
      fetchCars();
      fetchWeeks();
    } catch (err) {
      setSyncMsg(err.response?.data?.error || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleQuickSync = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      const { data: { nextWeek } } = await axios.get(`${API}/auctions/next-week`);
      const { data } = await axios.post(`${API}/auctions/sync`, { weekNo: nextWeek }, { headers: authHeader });
      setSyncMsg(`Done! Week ${nextWeek} → ${data.inserted} cars saved.`);
      setSyncWeek(String(nextWeek));
      fetchCars();
      fetchWeeks();
    } catch (err) {
      setSyncMsg(err.response?.data?.error || 'Quick sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="admin-title-section">
            <h1>Admin Panel</h1>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/" className="back-to-site">← Back to Site</Link>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">

        {/* Sync */}
        <div className="admin-section">
          <h2>Sync from ssancar.com</h2>
          <form className="sync-form" onSubmit={handleSync}>
            <input
              type="number"
              placeholder="Week No (e.g. 5)"
              value={syncWeek}
              onChange={e => setSyncWeek(e.target.value)}
              min="1"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={syncing}>
              {syncing ? 'Syncing...' : 'Sync'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleQuickSync} disabled={syncing}>
              ⚡ Quick Sync (Next Week)
            </button>
            {syncMsg && <span className="sync-msg">{syncMsg}</span>}
          </form>
        </div>

        {/* Add car */}
        <div className="admin-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Auction Cars ({total})</h2>
            <button className="btn btn-primary" onClick={() => { setFormData(emptyForm); setIsFormOpen(true); }}>
              + Add Car
            </button>
          </div>

          {/* Week filter */}
          <div className="filter-row">
            <select value={weekFilter} onChange={e => { setWeekFilter(e.target.value); setPage(1); }}>
              <option value="">All Weeks</option>
              {weeks.map(w => <option key={w} value={w}>Week {w}</option>)}
            </select>
          </div>
        </div>

        {/* Form modal */}
        {isFormOpen && (
          <div className="car-form-modal">
            <div className="car-form-content">
              <h2>Add Car Manually</h2>
              <form onSubmit={handleAddSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Week No *</label>
                    <input type="number" name="week_no" value={formData.week_no} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Stock No</label>
                    <input type="number" name="stock_no" value={formData.stock_no} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} min="1900" max="2030" />
                  </div>
                  <div className="form-group">
                    <label>Transmission</label>
                    <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                      <option value="A/T">A/T</option>
                      <option value="M/T">M/T</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Fuel</label>
                    <select name="fuel" value={formData.fuel} onChange={handleInputChange}>
                      <option>Gasoline</option>
                      <option>Diesel</option>
                      <option>Hybrid</option>
                      <option>Electric</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>CC</label>
                    <input type="text" name="cc" value={formData.cc} onChange={handleInputChange} placeholder="e.g. 1,591cc" />
                  </div>
                  <div className="form-group">
                    <label>KM</label>
                    <input type="number" name="km" value={formData.km} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Grade</label>
                    <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} placeholder="e.g. A/5" />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Price (USD)</label>
                    <input type="number" name="price_usd" value={formData.price_usd} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Link</label>
                    <input type="url" name="link" value={formData.link} onChange={handleInputChange} />
                  </div>
                  <div className="form-group form-group-full">
                    <label>Image URL</label>
                    <input type="url" name="image" value={formData.image} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="cars-table">
          {loading ? (
            <p style={{ padding: '1rem' }}>Loading...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Week</th>
                    <th>Stock No</th>
                    <th>Name</th>
                    <th>Year</th>
                    <th>KM</th>
                    <th>Price (USD)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id} className={!car.is_active ? 'row-passive' : ''}>
                      <td>{car.week_no}</td>
                      <td>{car.stock_no}</td>
                      <td>{car.name}</td>
                      <td>{car.year}</td>
                      <td>{car.km?.toLocaleString()}</td>
                      <td>${car.price_usd?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${car.is_active ? 'active' : 'passive'}`}>
                          {car.is_active ? 'Active' : 'Passive'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className={`btn-action ${car.is_active ? 'btn-passive' : 'btn-edit'}`}
                          onClick={() => handleToggleStatus(car)}
                        >
                          {car.is_active ? 'Set Passive' : 'Set Active'}
                        </button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(car)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cars.length === 0 && (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem' }}>No cars found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
              <span>Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
