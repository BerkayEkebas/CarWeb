import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockCars } from '../data/mockData';
import './CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const car = mockCars.find(c => c.id === parseInt(id));
  const [currentImage, setCurrentImage] = useState(0);

  if (!car) {
    return (
      <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Car not found</h2>
        <Link to="/stock" className="btn btn-primary">Back to Stock</Link>
      </div>
    );
  }

  return (
    <div className="car-detail-page">
      <div className="container">
        <Link to="/stock" className="back-link">← Back to Stock</Link>
        
        <div className="detail-grid">
          <div className="image-section">
            <div className="main-image-wrapper">
              <img 
                src={car.images[currentImage]} 
                alt={`${car.brand} ${car.model}`} 
                className="main-image"
              />
              <div className="image-counter">{currentImage + 1} / {car.images.length}</div>
            </div>
            
            <div className="thumbnail-gallery">
              {car.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${car.brand} ${car.model} ${index + 1}`}
                  className={`thumbnail ${currentImage === index ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          </div>

          <div className="info-section">
            <div className="stock-number">S/No.{car.stockNumber}</div>
            <h1 className="car-title">{car.brand} {car.model}</h1>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">VIN</span>
                <span className="info-value">{car.vin}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Chassis</span>
                <span className="info-value">{car.chassisNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{t('year')}</span>
                <span className="info-value">{car.year}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Mileage</span>
                <span className="info-value">{car.mileage.toLocaleString()} {t('km')}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Transmission</span>
                <span className="info-value">{car.transmission}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fuel Type</span>
                <span className="info-value">{car.fuelType}</span>
              </div>
            </div>

            <div className="price-section">
              <div className="price-label">{t('dealerPrice')}</div>
              <div className="price">{car.price.toLocaleString()}{car.currency}</div>
            </div>

            <button className="contact-btn">{t('askBranchManager')} 👤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
