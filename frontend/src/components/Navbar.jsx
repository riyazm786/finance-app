import { Link, useLocation } from 'react-router-dom';
import { Wallet, LayoutDashboard, Calculator, Briefcase, BarChart2, User, Landmark, History as HistoryIcon, TrendingUp, TrendingDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <Wallet color="var(--accent-primary)" />
          <span>Fin</span>Track
        </Link>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Dashboard</Link>
          <Link to="/portfolio" className={`nav-link ${isActive('/portfolio')}`}>Portfolio</Link>
          <Link to="/income" className={`nav-link ${isActive('/income')}`}>Income</Link>
          <Link to="/expense" className={`nav-link ${isActive('/expense')}`}>Expense</Link>
          <Link to="/history" className={`nav-link ${isActive('/history')}`}>History</Link>
          <Link to="/emi" className={`nav-link ${isActive('/emi')}`}>EMI Calc</Link>
          <Link to="/tax" className={`nav-link ${isActive('/tax')}`}>Tax Calc</Link>
          
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>
          
          <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} /> Profile
          </Link>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav">
        <Link to="/" className={`mobile-nav-item ${isActive('/')}`}>
          <LayoutDashboard size={24} />
          <span>Dash</span>
        </Link>
        <Link to="/portfolio" className={`mobile-nav-item ${isActive('/portfolio')}`}>
          <Briefcase size={24} />
          <span>Portfolio</span>
        </Link>
        <Link to="/income" className={`mobile-nav-item ${isActive('/income')}`}>
          <TrendingUp size={24} />
          <span>Income</span>
        </Link>
        <Link to="/expense" className={`mobile-nav-item ${isActive('/expense')}`}>
          <TrendingDown size={24} />
          <span>Expense</span>
        </Link>
        <Link to="/history" className={`mobile-nav-item ${isActive('/history')}`}>
          <HistoryIcon size={24} />
          <span>History</span>
        </Link>
        <Link to="/emi" className={`mobile-nav-item ${isActive('/emi')}`}>
          <Landmark size={24} />
          <span>EMI</span>
        </Link>
        <Link to="/tax" className={`mobile-nav-item ${isActive('/tax')}`}>
          <Calculator size={24} />
          <span>Tax</span>
        </Link>
        <Link to="/profile" className={`mobile-nav-item ${isActive('/profile')}`}>
          <User size={24} />
          <span>Me</span>
        </Link>
      </div>
    </>
  );
}
