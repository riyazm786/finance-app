import { Link, useLocation } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Wallet color="var(--accent-primary)" />
        <span>Fin</span>Track
      </Link>
      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" className={`nav-link ${isActive('/')}`}>Dashboard</Link>
        <Link to="/add" className={`nav-link ${isActive('/add')}`}>Add Record</Link>
        <Link to="/history" className={`nav-link ${isActive('/history')}`}>History</Link>
        <Link to="/charts" className={`nav-link ${isActive('/charts')}`}>Charts</Link>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>
        
        <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Login</Link>
        <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Sign Up</Link>
      </div>
    </nav>
  );
}
