import { Link, useLocation } from 'react-router-dom';
import { Target } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar panel">
      <div className="navbar-container">
        {/* Logo Left */}
        <div className="navbar-logo">
          <Target className="logo-icon" size={24} />
          <span className="logo-text">NxTYield</span>
        </div>

        {/* Center Navigation */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/weather" className={`nav-link ${isActive('/weather') ? 'active' : ''}`}>Weather</Link>
          <Link to="/crop" className={`nav-link ${isActive('/crop') ? 'active' : ''}`}>Crop Plan</Link>
          <Link to="/ai-insights" className={`nav-link ${isActive('/ai-insights') ? 'active' : ''}`}>AI Insights</Link>
          <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>Assistant</Link>
          <Link to="/system" className={`nav-link ${isActive('/system') ? 'active' : ''}`}>System</Link>
        </div>

        {/* Right Side Farm Context */}
        <div className="navbar-context">
          <div className="context-item">
            <span className="context-label">FARM</span>
            <span className="context-value data-readout">Demo Farm</span>
          </div>
          <div className="context-item">
            <span className="context-label">SEASON</span>
            <span className="context-value data-readout text-warning">Kharif</span>
          </div>
          <div className="live-indicator">
            <div className="pulse-dot"></div>
            <span className="data-readout">Connected</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
