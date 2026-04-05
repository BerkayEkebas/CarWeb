import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockAgencies, countries } from '../data/mockData';
import './Agencies.css';

const Agencies = () => {
  const { t } = useTranslation();
  const [expandedCountries, setExpandedCountries] = useState({});

  const toggleCountry = (countryCode) => {
    setExpandedCountries(prev => ({
      ...prev,
      [countryCode]: !prev[countryCode]
    }));
  };

  return (
    <div className="agencies-page">
      <div className="agencies-header">
        <h1>{t('findAgency')}</h1>
      </div>

      <div className="container">
        <div className="local-agency-section">
          <div className="local-header">
            <span>Local Agency</span>
            <span className="click-hint">Click To Up</span>
          </div>
        </div>

        <div className="countries-list">
          {countries.map(country => (
            <div key={country.code} className="country-item">
              <button 
                className="country-button"
                onClick={() => toggleCountry(country.code)}
              >
                <div className="country-info">
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                </div>
                <span className="expand-icon">
                  {expandedCountries[country.code] ? '▲' : '▼'}
                </span>
              </button>
              
              {expandedCountries[country.code] && (
                <div className="agencies-list">
                  {mockAgencies.map(agency => (
                    <div key={agency.id} className="agency-card">
                      <div className="agency-header-card">
                        <img src={agency.avatar} alt={agency.name} className="agency-avatar" />
                        <div className="agency-info">
                          <h3 className="agency-name">{agency.name}</h3>
                          <div className="agency-rating">
                            <span className="star">⭐</span>
                            <span className="rating-value">{agency.rating}</span>
                            <span className="reviews-count">{agency.reviews}.</span>
                          </div>
                        </div>
                        {agency.certified && (
                          <div className="certified-badge">
                            Certified<br/>Professional
                          </div>
                        )}
                      </div>
                      <p className="agency-description">{agency.description}</p>
                      <div className="agency-footer">
                        <div className="languages">
                          {agency.languages.map((lang, i) => (
                            <span key={i} className="language-flag">{lang}</span>
                          ))}
                          <span className="language-label">Language</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="managers-section">
          <h2 className="managers-title">
            Managers <span className="managers-country">in Korea</span>
          </h2>
          <p className="managers-subtitle">{t('certifiedProfessional')}</p>
          
          <div className="managers-grid">
            {mockAgencies.map(agency => (
              <div key={agency.id} className="manager-card">
                <div className="manager-header">
                  <img src={agency.avatar} alt={agency.name} className="manager-avatar" />
                  {agency.certified && (
                    <div className="certified-badge-small">
                      Certified<br/>Professional
                    </div>
                  )}
                </div>
                <h3 className="manager-name">{agency.name}</h3>
                <p className="manager-description">{agency.description}</p>
                <div className="manager-footer">
                  <div className="manager-rating">
                    <span className="star">⭐</span>
                    <span>{agency.rating}</span>
                  </div>
                  <div className="manager-reviews">{agency.reviews}.</div>
                  <div className="manager-languages">
                    {agency.languages.map((lang, i) => (
                      <span key={i}>{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agencies;
