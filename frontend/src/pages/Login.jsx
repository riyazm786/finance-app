export default function Login() {
  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2>Login</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Welcome back to FinTrack</p>
        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
