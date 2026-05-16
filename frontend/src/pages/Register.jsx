import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Link } from 'react-router-dom';

export default function Register() {
  const { register } = useFinance();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Start tracking your finances today</p>
        
        {error && <div style={{ color: 'var(--accent-danger)', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
