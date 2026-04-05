import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CarCard from '../components/CarCard';
import { mockCars } from '../data/mockData';
import './Stock.css';

const Stock = () => {
  const { t } = useTranslation();
  const [cars] = useState(mockCars);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [yearRange, setYearRange] = useState({ min: '', max: '' });
  const [mileageRange, setMileageRange] = useState({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Benzersiz markalar
  const brands = useMemo(() => {
    return [...new Set(cars.map(car => car.brand))].sort();
  }, [cars]);

  // Filtrelenmiş arabalar
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Arama
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.stockNumber.toLowerCase().includes(searchLower);

      // Marka filtresi
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(car.brand);

      // Yıl filtresi
      const matchesYear = (!yearRange.min || car.year >= parseInt(yearRange.min)) &&
                         (!yearRange.max || car.year <= parseInt(yearRange.max));

      // Kilometre filtresi
      const matchesMileage = (!mileageRange.min || car.mileage >= parseInt(mileageRange.min)) &&
                            (!mileageRange.max || car.mileage <= parseInt(mileageRange.max));

      // Fiyat filtresi
      const matchesPrice = (!priceRange.min || car.price >= parseInt(priceRange.min)) &&
                          (!priceRange.max || car.price <= parseInt(priceRange.max));

      // Yakıt tipi filtresi
      const matchesFuel = selectedFuelTypes.length === 0 || selectedFuelTypes.includes(car.fuelType);

      // Şanzıman filtresi
      const matchesTransmission = selectedTransmissions.length === 0 || selectedTransmissions.includes(car.transmission);

      return matchesSearch && matchesBrand && matchesYear && matchesMileage && 
             matchesPrice && matchesFuel && matchesTransmission;
    });
  }, [cars, searchTerm, selectedBrands, yearRange, mileageRange, priceRange, selectedFuelTypes, selectedTransmissions]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleFuelType = (fuelType) => {
    setSelectedFuelTypes(prev => 
      prev.includes(fuelType) ? prev.filter(f => f !== fuelType) : [...prev, fuelType]
    );
  };

  const toggleTransmission = (transmission) => {
    setSelectedTransmissions(prev => 
      prev.includes(transmission) ? prev.filter(t => t !== transmission) : [...prev, transmission]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrands([]);
    setYearRange({ min: '', max: '' });
    setMileageRange({ min: '', max: '' });
    setPriceRange({ min: '', max: '' });
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
  };

  return (
    <div className="stock-page">
      {/* Arama Çubuğu */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            placeholder={t('search') + ' (Brand, Model, Stock No...)'} 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>
      
      <div className="market-selector">
        <div className="market-info">
          <span className="market-label">{t('domesticMarket')}</span>
          <span className="flag">🇰🇷</span>
        </div>
      </div>

      <div className="results-bar">
        <span className="results-count">{filteredCars.length} {t('results')}</span>
        <div className="view-controls">
          <button 
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Filters
          </button>
          <button className="view-btn active">☰</button>
          <button className="view-btn">▦</button>
        </div>
      </div>

      <div className="container">
        <div className="stock-content">
          {/* Filtreler */}
          {showFilters && (
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Filters</h3>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All
                </button>
              </div>

              {/* Marka Filtresi */}
              <div className="filter-group">
                <h4>🚗 Brand</h4>
                <div className="filter-options">
                  {brands.map(brand => (
                    <label key={brand} className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Yıl Filtresi */}
              <div className="filter-group">
                <h4>📅 Year</h4>
                <div className="range-inputs">
                  <input 
                  style={{maxWidth:80}}
                    type="number"
                    placeholder="Min"
                    value={yearRange.min}
                    onChange={(e) => setYearRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <span>-</span>
                  <input 
                    style={{maxWidth:80}}
                    type="number"
                    placeholder="Max"
                    value={yearRange.max}
                    onChange={(e) => setYearRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {/* Kilometre Filtresi */}
              <div className="filter-group">
                <h4>🛣️ Mileage (km)</h4>
                <div className="range-inputs">
                  <input 
                  style={{maxWidth:80}}
                    type="number"
                    placeholder="Min"
                    value={mileageRange.min}
                    onChange={(e) => setMileageRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <span>-</span>
                  <input 
                  style={{maxWidth:80}}
                    type="number"
                    placeholder="Max"
                    value={mileageRange.max}
                    onChange={(e) => setMileageRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {/* Fiyat Filtresi */}
              <div className="filter-group">
                <h4>💰 Price ($)</h4>
                <div className="range-inputs">
                  <input 
                  style={{maxWidth:80}}
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <span>-</span>
                  <input 
                  style={{maxWidth:80}}
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {/* Yakıt Tipi Filtresi */}
              <div className="filter-group">
                <h4>⛽ Fuel Type</h4>
                <div className="filter-options">
                  {['Gasoline', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                    <label key={fuel} className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={selectedFuelTypes.includes(fuel)}
                        onChange={() => toggleFuelType(fuel)}
                      />
                      <span>{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Şanzıman Filtresi */}
              <div className="filter-group">
                <h4>⚙️ Transmission</h4>
                <div className="filter-options">
                  {['Automatic', 'Manual'].map(trans => (
                    <label key={trans} className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={selectedTransmissions.includes(trans)}
                        onChange={() => toggleTransmission(trans)}
                      />
                      <span>{trans}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Araba Listesi */}
          <div className="cars-grid">
            {filteredCars.length > 0 ? (
              filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <div className="no-results">
                <p>No cars found matching your filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
