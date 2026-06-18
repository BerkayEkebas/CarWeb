import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { parseCarName, formatPrice, formatKm } from '../utils/car';
import './CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    axios.get(`/api/auctions/${id}`)
      .then(r => { if (active) setCar(r.data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="detail-state">Loading...</div>;
  if (error || !car) {
    return (
      <div className="detail-state">
        <p>Vehicle not found.</p>
        <Link to="/auction" className="btn-back">← Back to Auctions</Link>
      </div>
    );
  }

  const { maker, model } = parseCarName(car.name);

  const specs = [
    { label: 'Maker', value: maker || '—' },
    { label: 'Year', value: car.year || '—' },
    { label: 'Mileage', value: formatKm(car.km) },
    { label: 'Transmission', value: car.transmission || '—' },
    { label: 'Fuel', value: car.fuel || '—' },
    { label: 'Engine', value: car.cc || '—' },
    { label: 'Auction Grade', value: car.grade || '—' },
    { label: 'Color', value: car.color || '—' },
    { label: 'Stock No', value: car.stock_no || '—' },
    { label: 'Auction Week', value: `Week ${car.week_no}` },
  ];

  return (
    <div className="detail-page">
      <div className="detail-container">
        <Link to="/auction" className="btn-back">← Back to Auctions</Link>

        <div className="detail-grid">
          <div className="detail-media">
            {car.image
              ? <img src={car.image} alt={car.name} className="detail-image" />
              : <div className="detail-image-placeholder">No Image Available</div>
            }
            <div className="detail-badges">
              <span className="detail-badge week">Week {car.week_no}</span>
              {maker && <span className="detail-badge maker">{maker}</span>}
            </div>
          </div>

          <div className="detail-info">
            <div className="detail-eyebrow">S/No. {car.stock_no}</div>
            <h1 className="detail-title">{model}</h1>

            <div className="detail-price-box">
              <span className="detail-price-label">Auction Price</span>
              <span className="detail-price">{formatPrice(car.price_usd)}</span>
            </div>

            <ul className="spec-list">
              {specs.map(s => (
                <li key={s.label}>
                  <span className="spec-label">{s.label}</span>
                  <span className="spec-value">{s.value}</span>
                </li>
              ))}
            </ul>

            {car.link && (
              <a
                href={car.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-view-source"
              >
                View on Auction Site ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
