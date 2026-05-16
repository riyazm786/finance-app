export default function Register() {
  return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2>Create Account</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Start tracking your finances today</p>
        <form>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="john@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" />
          </div>
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
