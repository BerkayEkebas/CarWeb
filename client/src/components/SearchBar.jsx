import { useTranslation } from 'react-i18next';
import './SearchBar.css';

const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input 
          type="text" 
          placeholder={t('search')} 
          className="search-input"
        />
        <button className="search-btn">🔍</button>
      </div>
    </div>
  );
};

export default SearchBar;
