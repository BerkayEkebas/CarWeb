import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { mockCars } from '../data/mockData';
import './Admin.css';

const Admin = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState(mockCars);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    price: 0,
    vin: '',
    chassisNumber: '',
    stockNumber: '',
    images: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCar) {
      // Update existing car
      setCars(prev => prev.map(car => 
        car.id === editingCar.id 
          ? { ...formData, id: editingCar.id, currency: '$' }
          : car
      ));
    } else {
      // Add new car
      const newCar = {
        ...formData,
        id: Math.max(...cars.map(c => c.id)) + 1,
        currency: '$',
        featured: false
      };
      setCars(prev => [...prev, newCar]);
    }
    resetForm();
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      mileage: car.mileage,
      transmission: car.transmission,
      fuelType: car.fuelType,
      price: car.price,
      vin: car.vin,
      chassisNumber: car.chassisNumber,
      stockNumber: car.stockNumber,
      images: car.images
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setCars(prev => prev.filter(car => car.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: 0,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      price: 0,
      vin: '',
      chassisNumber: '',
      stockNumber: '',
      images: ['']
    });
    setEditingCar(null);
    setIsFormOpen(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="admin-title-section">
            <h1>{t('admin.title')}</h1>
            <Link to="/stock" className="back-to-site">← Back to Site</Link>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsFormOpen(true)}
          >
            + {t('admin.addCar')}
          </button>
        </div>
      </div>

      <div className="container">
        {isFormOpen && (
          <div className="car-form-modal">
            <div className="car-form-content">
              <h2>{editingCar ? t('admin.editCar') : t('admin.addCar')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('admin.brand')}</label>
                    <input 
                      type="text" 
                      name="brand" 
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('admin.model')}</label>
                    <input 
                      type="text" 
                      name="model" 
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Number</label>
                    <input 
                      type="text" 
                      name="stockNumber" 
                      value={formData.stockNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>VIN</label>
                    <input 
                      type="text" 
                      name="vin" 
                      value={formData.vin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Chassis Number</label>
                    <input 
                      type="text" 
                      name="chassisNumber" 
                      value={formData.chassisNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('year')}</label>
                    <input 
                      type="number" 
                      name="year" 
                      value={formData.year}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('admin.mileage')} (km)</label>
                    <input 
                      type="number" 
                      name="mileage" 
                      value={formData.mileage}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('admin.transmission')}</label>
                    <select 
                      name="transmission" 
                      value={formData.transmission}
                      onChange={handleInputChange}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t('admin.fuelType')}</label>
                    <select 
                      name="fuelType" 
                      value={formData.fuelType}
                      onChange={handleInputChange}
                    >
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t('admin.price')} ($)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-full">
                  <label>{t('admin.images')} (URLs)</label>
                  {formData.images.map((img, index) => (
                    <input 
                      key={index}
                      type="url" 
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Image URL ${index + 1}`}
                      className="image-input"
                      required
                    />
                  ))}
                  <button 
                    type="button" 
                    className="btn-add-image"
                    onClick={addImageField}
                  >
                    + Add Image URL
                  </button>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {t('admin.save')}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    {t('admin.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="cars-table">
          <h2>{t('admin.carList')}</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Stock No.</th>
                  <th>{t('admin.brand')}</th>
                  <th>{t('admin.model')}</th>
                  <th>{t('year')}</th>
                  <th>{t('admin.price')}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id}>
                    <td>{car.stockNumber}</td>
                    <td>{car.brand}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>${car.price.toLocaleString()}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => handleEdit(car)}
                      >
                        {t('admin.edit')}
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(car.id)}
                      >
                        {t('admin.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
