import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Stock from './pages/Stock';
import CarDetail from './pages/CarDetail';
import Agencies from './pages/Agencies';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/car/:id" element={<CarDetail />} />
            <Route path="/auction" element={<Stock />} />
            <Route path="/inspected" element={<Stock />} />
            <Route path="/agencies" element={<Agencies />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
