/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CarCard.css';

const CarCard = ({ car }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/car/${car.id}`} className="car-card">
      <div className="car-image-wrapper">
        <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="car-image" />
        {car.featured && <span className="badge-featured">Featured</span>}
      </div>
      
      <div className="car-info">
        <div className="car-stock">S/No.{car.stockNumber}</div>
        <h3 className="car-title">{car.brand} {car.model}</h3>
        <div className="car-details">
          <span>{car.vin}</span>
          <span className="separator">|</span>
          <span>{car.chassisNumber}</span>
        </div>
        <div className="car-specs">
          <span>{car.year}</span>
          <span className="separator">|</span>
          <span>{car.mileage.toLocaleString()}{t('km')}</span>
          <span className="separator">|</span>
          <span>{t(car.transmission.toLowerCase())}</span>
        </div>
        <div className="car-fuel">{t(car.fuelType.toLowerCase())}</div>
        
        <div className="car-price-section">
          <span className="price-label">{t('dealerPrice')}</span>
          <span className="price">{car.price.toLocaleString()}{car.currency}</span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
