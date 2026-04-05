import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Car</h1>
          <p className="hero-subtitle">Premium Car Trading Platform</p>
          <div className="hero-buttons">
            <Link to="/stock" className="btn btn-primary">Browse Stock</Link>
            <Link to="/agencies" className="btn btn-secondary">Find Agencies</Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2>Why Choose Car?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Wide Selection</h3>
              <p>Thousands of quality vehicles from trusted dealers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Inspected Cars</h3>
              <p>All vehicles thoroughly inspected and certified</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing and transparent deals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Certified agencies in multiple countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
