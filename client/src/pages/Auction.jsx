import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CarCard from '../components/CarCard';
import './Auction.css';

const LIMIT = 20;

const emptyFilters = {
  q: '',
  weekNo: '',
  maker: '',
  fuel: '',
  transmission: '',
  color: '',
  yearFrom: '',
  yearTo: '',
  priceFrom: '',
  priceTo: '',
  sort: 'newest',
};

const Auction = () => {
  const { t } = useTranslation();

  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState([]);
  const [options, setOptions] = useState({ makers: [], colors: [], fuels: [], transmissions: [] });

  const [filters, setFilters] = useState(emptyFilters);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get('/api/auctions/weeks').then(r => setWeeks(r.data)).catch(() => {});
    axios.get('/api/auctions/filters').then(r => setOptions(r.data)).catch(() => {});
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, activeOnly: 'true' };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await axios.get('/api/auctions', { params });
      setCars(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const totalPages = Math.ceil(total / LIMIT);

  const update = (key) => (e) => {
    setFilters(f => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, q: search.trim() }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setSearch('');
    setPage(1);
  };

  const activeCount = Object.entries(filters)
    .filter(([k, v]) => v && k !== 'sort').length;

  return (
    <div className="auction-page">
      <div className="auction-hero">
        <h1>{t('nav.auction')}</h1>
        <p>{total.toLocaleString()} {t('vehicles') || 'vehicles'} available</p>
      </div>

      <div className="auction-layout">
        <aside className="auction-sidebar">
          <div className="sidebar-head">
            <h2>Filters</h2>
            {activeCount > 0 && (
              <button type="button" className="reset-btn" onClick={resetFilters}>
                Clear ({activeCount})
              </button>
            )}
          </div>

          <form className="filter-block" onSubmit={submitSearch}>
            <label>Search</label>
            <div className="search-row">
              <input
                type="text"
                placeholder="Model or maker…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit">Go</button>
            </div>
          </form>

          <div className="filter-block">
            <label>Maker</label>
            <select value={filters.maker} onChange={update('maker')}>
              <option value="">All Makers</option>
              {options.makers.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="filter-block">
            <label>Auction Week</label>
            <select value={filters.weekNo} onChange={update('weekNo')}>
              <option value="">All Weeks</option>
              {weeks.map(w => <option key={w} value={w}>Week {w}</option>)}
            </select>
          </div>

          <div className="filter-block">
            <label>Fuel Type</label>
            <select value={filters.fuel} onChange={update('fuel')}>
              <option value="">All Fuel Types</option>
              {options.fuels.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="filter-block">
            <label>Transmission</label>
            <select value={filters.transmission} onChange={update('transmission')}>
              <option value="">All Transmissions</option>
              {options.transmissions.map(tr => (
                <option key={tr} value={tr}>{tr === 'A/T' ? 'Automatic' : tr === 'M/T' ? 'Manual' : tr}</option>
              ))}
            </select>
          </div>

          <div className="filter-block">
            <label>Color</label>
            <select value={filters.color} onChange={update('color')}>
              <option value="">All Colors</option>
              {options.colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-block">
            <label>Year</label>
            <div className="range-group">
              <input type="number" placeholder="From" value={filters.yearFrom} onChange={update('yearFrom')} />
              <span>–</span>
              <input type="number" placeholder="To" value={filters.yearTo} onChange={update('yearTo')} />
            </div>
          </div>

          <div className="filter-block">
            <label>Price (USD)</label>
            <div className="range-group">
              <input type="number" placeholder="Min" value={filters.priceFrom} onChange={update('priceFrom')} />
              <span>–</span>
              <input type="number" placeholder="Max" value={filters.priceTo} onChange={update('priceTo')} />
            </div>
          </div>
        </aside>

        <div className="auction-main">
          <div className="auction-toolbar">
            <span className="result-count">{total.toLocaleString()} results</span>
            <select value={filters.sort} onChange={update('sort')}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="year_desc">Year: Newest</option>
              <option value="year_asc">Year: Oldest</option>
              <option value="km_asc">Mileage: Lowest</option>
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              <div className="cars-grid">
                {cars.map(car => <CarCard key={car.id} car={car} />)}
                {cars.length === 0 && <p className="no-results">No vehicles found. Try adjusting your filters.</p>}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
                  <span>Page {page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auction;
