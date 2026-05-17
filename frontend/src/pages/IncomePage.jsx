import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, TrendingUp, PlusCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      
      const res = await axios.get(`${API_URL}/api/income`, { headers });
      setIncomes(res.data.sort((a,b) => new Date(b.date || b.createdAt || b.year + "-" + b.month) - new Date(a.date || a.createdAt || a.year + "-" + a.month)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !source) return;

    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const parsedDate = new Date(date);
      const monthStr = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
      
      const payload = {
        amount: Number(amount),
        source,
        description,
        date: parsedDate.toISOString(),
        month: monthStr,
        year: parsedDate.getFullYear()
      };

      await axios.post(`${API_URL}/api/income`, payload, { headers });
      
      // Reset form and refresh
      setAmount('');
      setSource('Salary');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      
      fetchIncomes();
    } catch (err) {
      console.error("Failed to add income", err);
      alert("Failed to add income");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income record?")) return;
    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`${API_URL}/api/income/${id}`, { headers });
      fetchIncomes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete record");
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Unknown Date";
    return d.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  // Summaries
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const thisMonthIncomes = incomes.filter(i => {
    const d = new Date(i.date || i.createdAt || i.year + "-" + i.month);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  const salaryThisMonth = thisMonthIncomes
    .filter(i => i.source.toLowerCase() === 'salary')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalIncomeAllTime = incomes.reduce((sum, i) => sum + i.amount, 0);
  const entriesThisMonth = thisMonthIncomes.length;

  return (
    <div className="animate-fade-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem', color: 'var(--accent-success)' }}>
            <TrendingUp size={28}/> Income Management
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your revenue streams.</p>
        </div>
      </div>

      {/* SUMMARY SECTION */}
      <div className="dash-grid" style={{ marginBottom: '2rem' }}>
        <div className="col-span-4 glass-card" style={{ borderTop: '4px solid var(--accent-success)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Salary This Month</p>
          <h3 className="text-success" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(salaryThisMonth)}</h3>
        </div>
        <div className="col-span-4 glass-card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Income All Time</p>
          <h3 className="gradient-text" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(totalIncomeAllTime)}</h3>
        </div>
        <div className="col-span-4 glass-card" style={{ borderTop: '4px solid var(--accent-info)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Entries This Month</p>
          <h3 className="text-info" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{entriesThisMonth}</h3>
        </div>
      </div>

      <div className="dash-grid">
        {/* ADD INCOME FORM */}
        <div className="col-span-4">
          <div className="glass-card" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle color="var(--accent-success)" size={20}/> Add Income
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Amount (₹)</label>
                <input 
                  type="number" 
                  required 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 50000" 
                />
              </div>

              <div className="input-group">
                <label>Source</label>
                <select required value={source} onChange={e => setSource(e.target.value)}>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Description (Optional)</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. June Salary" 
                />
              </div>

              <div className="input-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success" style={{ width: '100%', marginTop: '1rem' }}>
                Add Income
              </button>
            </form>
          </div>
        </div>

        {/* INCOME TABLE */}
        <div className="col-span-8">
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Loading incomes...</p>
            ) : incomes.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No income records found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1rem' }}>#</th>
                      <th style={{ padding: '1rem' }}>Source</th>
                      <th style={{ padding: '1rem' }}>Description</th>
                      <th style={{ padding: '1rem' }}>Amount</th>
                      <th style={{ padding: '1rem' }}>Date & Time</th>
                      <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomes.map((tx, index) => (
                      <tr key={tx._id || index} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{index + 1}</td>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{tx.source}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tx.description || '-'}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>
                          {formatCurrency(tx.amount)}
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {formatDate(tx.date || tx.createdAt || tx.year + "-" + tx.month)}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => deleteRecord(tx._id)}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.1)', 
                              border: 'none', 
                              padding: '0.5rem', 
                              borderRadius: 'var(--radius-sm)', 
                              color: 'var(--accent-danger)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                            title="Delete Record"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
