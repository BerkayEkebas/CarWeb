/* eslint-disable react/prop-types */
import './CarCard.css';

const CarCard = ({ car }) => {
  return (
    <a href={car.link} target="_blank" rel="noopener noreferrer" className="car-card">
      <div className="car-image-wrapper">
        {car.image
          ? <img src={car.image} alt={car.name} className="car-image" />
          : <div className="car-image-placeholder">No Image</div>
        }
        <span className="badge-week">Week {car.week_no}</span>
      </div>

      <div className="car-info">
        <div className="car-stock">S/No.{car.stock_no}</div>
        <h3 className="car-title">{car.name}</h3>
        <div className="car-specs">
          <span>{car.year}</span>
          <span className="separator">|</span>
          <span>{car.km?.toLocaleString()} km</span>
          <span className="separator">|</span>
          <span>{car.transmission}</span>
        </div>
        <div className="car-sub">
          <span>{car.fuel}</span>
          <span className="separator">·</span>
          <span>{car.cc}</span>
          <span className="separator">·</span>
          <span>{car.grade}</span>
        </div>

        <div className="car-price-section">
          <span className="price">${car.price_usd?.toLocaleString()}</span>
        </div>
      </div>
    </a>
  );
};

export default CarCard;
