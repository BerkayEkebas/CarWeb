import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CarCard from '../components/CarCard';
import './Auction.css';

const Auction = () => {
  const { t } = useTranslation();

  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState([]);

  const [weekNo, setWeekNo] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  useEffect(() => {
    axios.get('/api/auctions/weeks').then(r => setWeeks(r.data)).catch(() => {});
  }, []);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, activeOnly: 'true' };
      if (weekNo) params.weekNo = weekNo;
      if (fuel) params.fuel = fuel;
      if (transmission) params.transmission = transmission;
      const { data } = await axios.get('/api/auctions', { params });
      setCars(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, weekNo, fuel, transmission]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="auction-page">
      <div className="auction-hero">
        <h1>{t('nav.auction')}</h1>
        <p>{total} {t('vehicles') || 'vehicles'}</p>
      </div>

      <div className="container">
        <div className="auction-filters">
          <select value={weekNo} onChange={handleFilter(setWeekNo)}>
            <option value="">All Weeks</option>
            {weeks.map(w => <option key={w} value={w}>Week {w}</option>)}
          </select>

          <select value={fuel} onChange={handleFilter(setFuel)}>
            <option value="">All Fuel Types</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>

          <select value={transmission} onChange={handleFilter(setTransmission)}>
            <option value="">All Transmissions</option>
            <option value="A/T">Automatic</option>
            <option value="M/T">Manual</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="cars-grid">
              {cars.map(car => <CarCard key={car.id} car={car} />)}
              {cars.length === 0 && <p className="no-results">No vehicles found.</p>}
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
  );
};

export default Auction;
