import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, TrendingDown, PlusCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      
      const [expRes, incRes] = await Promise.all([
        axios.get(`${API_URL}/api/expenses`, { headers }),
        axios.get(`${API_URL}/api/income`, { headers })
      ]);
      
      setExpenses(expRes.data.sort((a,b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)));
      setIncomes(incRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const payload = {
        amount: Number(amount),
        category,
        description,
        date: new Date(date).toISOString() // Save as ISO string for better sorting/parsing
      };

      await axios.post(`${API_URL}/api/expenses`, payload, { headers });
      
      // Reset form and refresh
      setAmount('');
      setCategory('Food');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      
      fetchData();
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Failed to add expense");
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) return;
    try {
      const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      await axios.delete(`${API_URL}/api/expenses/${id}`, { headers });
      fetchData();
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

  // Derived calculations
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // This Month Expenses
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date || e.createdAt);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });

  const totalExpensesThisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Income this month
  const thisMonthIncomes = incomes.filter(i => {
    const d = new Date(i.date || i.createdAt || i.year + "-" + i.month);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });
  const totalIncomeThisMonth = thisMonthIncomes.reduce((sum, i) => sum + i.amount, 0);

  const remainingBalance = totalIncomeThisMonth - totalExpensesThisMonth;

  // Biggest category this month
  const categoryTotals = thisMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  let biggestCategory = 'N/A';
  let maxCatAmount = 0;
  for (const cat in categoryTotals) {
    if (categoryTotals[cat] > maxCatAmount) {
      maxCatAmount = categoryTotals[cat];
      biggestCategory = cat;
    }
  }

  const totalExpensesAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group expenses
  const previousMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date || e.createdAt);
    return d.getMonth() + 1 !== currentMonth || d.getFullYear() !== currentYear;
  });

  // Chart Data
  const chartColors = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', 
    '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#64748B'
  ];
  
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: chartColors.slice(0, Object.keys(categoryTotals).length),
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#F8FAFC' } }
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem', color: 'var(--accent-danger)' }}>
            <TrendingDown size={28}/> Expense Management
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track and analyze your spending.</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="dash-grid" style={{ marginBottom: '2rem' }}>
        <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Expenses This Month</p>
          <h3 className="text-danger" style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{formatCurrency(totalExpensesThisMonth)}</h3>
        </div>
        <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-success)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Remaining Balance (This Month)</p>
          <h3 className={remainingBalance >= 0 ? "text-success" : "text-danger"} style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>
            {formatCurrency(remainingBalance)}
          </h3>
        </div>
        <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-warning)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Biggest Category (This Month)</p>
          <h3 className="text-warning" style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{biggestCategory}</h3>
        </div>
        <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Expenses All Time</p>
          <h3 className="gradient-text" style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{formatCurrency(totalExpensesAllTime)}</h3>
        </div>
      </div>

      <div className="dash-grid">
        {/* ADD EXPENSE FORM & CHART */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle color="var(--accent-danger)" size={20}/> Add Expense
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Amount (₹)</label>
                <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 500" />
              </div>

              <div className="input-group">
                <label>Category</label>
                <select required value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Food">Food</option>
                  <option value="Rent">Rent</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Description (Optional)</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Groceries" />
              </div>

              <div className="input-group">
                <label>Date</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-danger" style={{ width: '100%', marginTop: '1rem' }}>
                Add Expense
              </button>
            </form>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem' }}>Spending Breakdown (This Month)</h3>
            {Object.keys(categoryTotals).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No expenses this month yet.</p>
            ) : (
              <div style={{ height: '220px' }}>
                <Pie data={pieData} options={chartOptions} />
              </div>
            )}
          </div>

        </div>

        {/* EXPENSES TABLE */}
        <div className="col-span-8">
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <p style={{ padding: '2rem', textAlign: 'center' }}>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No expense records found.</p>
            ) : (
              <div style={{ overflowX: 'auto', padding: '1rem' }}>
                
                {/* THIS MONTH */}
                {thisMonthExpenses.length > 0 && (
                  <>
                    <h3 style={{ margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>This Month</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '2rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                          <th style={{ padding: '1rem' }}>#</th>
                          <th style={{ padding: '1rem' }}>Category</th>
                          <th style={{ padding: '1rem' }}>Description</th>
                          <th style={{ padding: '1rem' }}>Amount</th>
                          <th style={{ padding: '1rem' }}>Date & Time</th>
                          <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {thisMonthExpenses.map((tx, index) => (
                          <tr key={tx._id || index} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{index + 1}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ 
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--accent-danger)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}>
                                {tx.category}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{tx.description || '-'}</td>
                            <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>
                              -{formatCurrency(tx.amount)}
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              {formatDate(tx.date || tx.createdAt)}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                              <button 
                                onClick={() => deleteRecord(tx._id)}
                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-danger)', cursor: 'pointer' }}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* PREVIOUS MONTHS */}
                {previousMonthExpenses.length > 0 && (
                  <>
                    <h3 style={{ margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Previous Months</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                          <th style={{ padding: '1rem' }}>#</th>
                          <th style={{ padding: '1rem' }}>Category</th>
                          <th style={{ padding: '1rem' }}>Description</th>
                          <th style={{ padding: '1rem' }}>Amount</th>
                          <th style={{ padding: '1rem' }}>Date & Time</th>
                          <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previousMonthExpenses.map((tx, index) => (
                          <tr key={tx._id || index} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{index + 1}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{ 
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: 'var(--accent-danger)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}>
                                {tx.category}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{tx.description || '-'}</td>
                            <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-danger)' }}>
                              -{formatCurrency(tx.amount)}
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              {formatDate(tx.date || tx.createdAt)}
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                              <button 
                                onClick={() => deleteRecord(tx._id)}
                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--accent-danger)', cursor: 'pointer' }}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
