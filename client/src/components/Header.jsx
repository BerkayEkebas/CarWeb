import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-top">
        <button className="menu-btn">☰</button>
        <Link to="/" className="logo">
          <span className="logo-text">Car</span>
        </Link>
        <div className="language-switcher">
          <button 
            className={i18n.language === 'en' ? 'active' : ''} 
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <span className="separator">|</span>
          <button 
            className={i18n.language === 'ko' ? 'active' : ''} 
            onClick={() => changeLanguage('ko')}
          >
            KO
          </button>
        </div>
      </div>
      
      <nav className="nav">
        <Link to="/" className={isActive('/')}>
          <span className="nav-icon">🏠</span>
          <span>{t('nav.home')}</span>
        </Link>
        <Link to="/auction" className={isActive('/auction')}>
          <span className="nav-icon">🔨</span>
          <span>{t('nav.auction')}</span>
        </Link>
        <Link to="/stock" className={isActive('/stock')}>
          <span className="nav-icon">🚗</span>
          <span>{t('nav.stock')}</span>
        </Link>
        <Link to="/inspected" className={isActive('/inspected')}>
          <span className="nav-icon">✓</span>
          <span>{t('nav.inspected')}</span>
        </Link>
        <Link to="/agencies" className={isActive('/agencies')}>
          <span className="nav-icon">👥</span>
          <span>{t('nav.agencies')}</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
