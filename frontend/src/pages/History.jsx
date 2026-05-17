import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, History as HistoryIcon, Search, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterMonth, setFilterMonth] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      
      const [incomeRes, expenseRes] = await Promise.all([
        axios.get(`${API_URL}/api/income`, { headers }),
        axios.get(`${API_URL}/api/expenses`, { headers })
      ]);
      
      const incomes = incomeRes.data.map(i => ({...i, type: 'income', date: i.createdAt || i.date || i.year + "-" + i.month }));
      const expenses = expenseRes.data.map(e => ({...e, type: 'expense', date: e.createdAt || e.date }));
      
      const allTx = [...incomes, ...expenses].sort((a,b) => new Date(b.date) - new Date(a.date));
      setTransactions(allTx);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      if (type === 'expense') {
        await axios.delete(`${API_URL}/api/expenses/${id}`, { headers });
      } else {
        await axios.delete(`${API_URL}/api/income/${id}`, { headers });
      }
      fetchTransactions(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Failed to delete record");
    }
  };

  // Generate unique months for the filter dropdown
  const months = [...new Set(transactions.map(tx => {
    const d = new Date(tx.date);
    if (isNaN(d.getTime())) return null;
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }).filter(Boolean))];

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (filterMonth !== 'all') {
      const d = new Date(tx.date);
      if (isNaN(d.getTime())) return false;
      const m = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
      if (m !== filterMonth) return false;
    }
    return true;
  });

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Unknown Date";
    return d.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="animate-fade-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem' }}>
            <HistoryIcon color="var(--accent-primary)" size={28}/> Transaction History
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage all your past records.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
            <button 
              className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-ghost'}`} 
              onClick={() => setFilterType('all')}
              style={{ padding: '0.5rem 1rem' }}
            >All</button>
            <button 
              className={`btn ${filterType === 'income' ? 'btn-success' : 'btn-ghost'}`} 
              onClick={() => setFilterType('income')}
              style={{ padding: '0.5rem 1rem' }}
            >Income</button>
            <button 
              className={`btn ${filterType === 'expense' ? 'btn-danger' : 'btn-ghost'}`} 
              onClick={() => setFilterType('expense')}
              style={{ padding: '0.5rem 1rem' }}
            >Expense</button>
          </div>

          <div className="input-group" style={{ marginBottom: 0, minWidth: '200px' }}>
            <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ padding: '0.6rem', width: '100%' }}>
              <option value="all">All Months</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</p>
        ) : filteredTransactions.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found for the selected filters.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem' }}>#</th>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Category/Source</th>
                  <th style={{ padding: '1rem' }}>Amount</th>
                  <th style={{ padding: '1rem' }}>Description</th>
                  <th style={{ padding: '1rem' }}>Date & Time</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <tr key={tx._id || index} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{index + 1}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: tx.type === 'income' ? 'var(--accent-success)' : 'var(--accent-danger)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{tx.category || tx.source}</td>
                    <td style={{ 
                      padding: '1rem', 
                      fontWeight: 'bold',
                      color: tx.type === 'income' ? 'var(--accent-success)' : 'var(--accent-danger)'
                    }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.description || '-'}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {formatDate(tx.date)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => deleteRecord(tx._id, tx.type)}
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
  );
}
