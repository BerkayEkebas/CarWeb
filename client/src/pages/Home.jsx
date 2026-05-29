import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <img src="/logo.jpeg" alt="K-Prime Motors" className="hero-logo" />
          <p className="hero-subtitle">Korean Vehicle Auction Platform</p>
          <div className="hero-buttons">
            <Link to="/auction" className="btn btn-primary">Browse Auctions</Link>
            <Link to="/agencies" className="btn btn-secondary">Find Agencies</Link>
          </div>
        </div>
      </div>

      <div className="features-section">
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
      </div>
    </div>
  );
};

export default Home;
