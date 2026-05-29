import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="header-top">
        <button className="menu-btn">☰</button>
        <Link to="/" className="logo">
          <img src="/logo.jpeg" alt="K-Prime Motors" className="logo-img" />
        </Link>
        <div className="language-switcher">
          <button
            className={i18n.language === 'en' ? 'active' : ''}
            onClick={() => i18n.changeLanguage('en')}
          >EN</button>
          <span className="separator">|</span>
          <button
            className={i18n.language === 'ko' ? 'active' : ''}
            onClick={() => i18n.changeLanguage('ko')}
          >KO</button>
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
        <Link to="/agencies" className={isActive('/agencies')}>
          <span className="nav-icon">👥</span>
          <span>{t('nav.agencies')}</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
