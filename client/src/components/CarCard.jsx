/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { parseCarName, formatPrice, formatKm } from '../utils/car';
import './CarCard.css';

const CarCard = ({ car }) => {
  const { maker, model } = parseCarName(car.name);

  return (
    <Link to={`/auction/${car.id}`} className="car-card">
      <div className="car-image-wrapper">
        {car.image
          ? <img src={car.image} alt={car.name} className="car-image" loading="lazy" />
          : <div className="car-image-placeholder">No Image</div>
        }
        <span className="badge-week">Week {car.week_no}</span>
        {maker && <span className="badge-maker">{maker}</span>}
      </div>

      <div className="car-info">
        <div className="car-stock">S/No.{car.stock_no}</div>
        <h3 className="car-title">{model}</h3>
        <div className="car-specs">
          <span>{car.year}</span>
          <span className="separator">|</span>
          <span>{formatKm(car.km)}</span>
          <span className="separator">|</span>
          <span>{car.transmission}</span>
        </div>
        <div className="car-sub">
          <span>{car.fuel}</span>
          <span className="separator">·</span>
          <span>{car.cc}</span>
          {car.grade && <><span className="separator">·</span><span>{car.grade}</span></>}
        </div>

        <div className="car-price-section">
          <span className="price">{formatPrice(car.price_usd)}</span>
          <span className="view-hint">View →</span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
