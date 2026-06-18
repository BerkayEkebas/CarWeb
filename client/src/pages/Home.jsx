import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CarCard from '../components/CarCard';
import './Home.css';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    axios.get('/api/auctions', { params: { limit: 8, activeOnly: 'true', sort: 'newest' } })
      .then(r => { setFeatured(r.data.data); setTotal(r.data.total); })
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <img src="/logo.jpeg" alt="K-Prime Motors" className="hero-logo" />
          <h1 className="hero-headline">Korean Auction Vehicles, Delivered Worldwide</h1>
          <p className="hero-subtitle">
            Browse fresh Korean auction listings every week — graded, priced in USD, ready to ship.
          </p>
          <div className="hero-buttons">
            <Link to="/auction" className="btn btn-primary">Browse Auctions →</Link>
            <Link to="/agencies" className="btn btn-secondary">Find Agencies</Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{total.toLocaleString()}+</span>
              <span className="stat-label">Vehicles Listed</span>
            </div>
            <div className="stat">
              <span className="stat-num">Weekly</span>
              <span className="stat-label">Fresh Auctions</span>
            </div>
            <div className="stat">
              <span className="stat-num">USD</span>
              <span className="stat-label">Transparent Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-head">
              <h2>Latest Auction Vehicles</h2>
              <Link to="/auction" className="see-all">See all →</Link>
            </div>
            <div className="featured-grid">
              {featured.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          </div>
        </section>
      )}

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔨</div>
              <h3>Weekly Auctions</h3>
              <p>Fresh Korean auction vehicles updated every week</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Graded Vehicles</h3>
              <p>All vehicles come with official auction grade reports</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Direct from Korean auction — competitive USD pricing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Certified agencies delivering worldwide</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
