import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  PlusCircle, MinusCircle, Wallet, TrendingUp, TrendingDown,
  Calendar, Clock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0, totalExpenses: 0, netSavings: 0,
    monthIncome: 0, monthExpenses: 0, monthSavings: 0,
    biggestExpenseCategory: 'N/A',
    recentTransactions: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('fin_token') || localStorage.getItem('token');
        if (!token) return;
        
        const headers = { Authorization: `Bearer ${token}` };
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`${API_URL}/api/income`, { headers }),
          axios.get(`${API_URL}/api/expenses`, { headers })
        ]);
        
        const incomes = incomeRes.data;
        const expenses = expenseRes.data;
        
        // All time totals
        const totalIncome = incomes.reduce((s,i) => s + i.amount, 0);
        const totalExpenses = expenses.reduce((s,e) => s + e.amount, 0);
        
        // This month
        const monthIncomes = incomes.filter(i => {
          const d = new Date(i.createdAt || i.date || i.year + "-" + i.month); // fallback for dates
          return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
        });
        const monthIncome = monthIncomes.reduce((s,i) => s + i.amount, 0);
          
        const monthExpensesArr = expenses.filter(e => {
          const d = new Date(e.createdAt || e.date);
          return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
        });
        const monthExpenses = monthExpensesArr.reduce((s,e) => s + e.amount, 0);
        
        // Biggest expense category this month
        const catTotals = monthExpensesArr.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {});
        
        let biggestCat = 'N/A';
        let maxAmt = 0;
        for(let cat in catTotals) {
          if(catTotals[cat] > maxAmt) {
            maxAmt = catTotals[cat];
            biggestCat = cat;
          }
        }
        
        // Recent transactions (combined, sorted newest first)
        const allTx = [
          ...incomes.map(i => ({...i, type:'income', date: i.createdAt || i.date || new Date().toISOString()})),
          ...expenses.map(e => ({...e, type:'expense', date: e.createdAt || e.date || new Date().toISOString()}))
        ].sort((a,b) => new Date(b.date) - new Date(a.date))
         .slice(0, 5);
        
        setSummary({
          totalIncome, totalExpenses,
          netSavings: totalIncome - totalExpenses,
          monthIncome, monthExpenses,
          monthSavings: monthIncome - monthExpenses,
          biggestExpenseCategory: biggestCat,
          recentTransactions: allTx
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const savingsRate = summary.totalIncome > 0 
    ? Math.round((summary.netSavings / summary.totalIncome) * 100) 
    : 0;

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div className="dash-grid animate-fade-up">
      
      {/* Header */}
      <div className="col-span-12 flex-between" style={{ marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem' }}>Dashboard 👋</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your financial overview based on real data.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/add" className="btn btn-success"><PlusCircle size={18}/> Add Income</Link>
          <Link to="/add" className="btn btn-danger"><MinusCircle size={18}/> Add Expense</Link>
        </div>
      </div>

      {/* --- 1. THIS MONTH SECTION --- */}
      <div className="col-span-12">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar color="var(--accent-primary)" size={22}/> This Month
        </h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-success)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Income This Month</p>
        <h3 className="text-success" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(summary.monthIncome)}</h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-danger)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Expenses This Month</p>
        <h3 className="text-danger" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(summary.monthExpenses)}</h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-info)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Savings This Month</p>
        <h3 className="text-info" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(summary.monthSavings)}</h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-warning)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Biggest Expense</p>
        <h3 className="text-warning" style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{summary.biggestExpenseCategory}</h3>
      </div>

      {/* --- 2. ALL TIME SECTION --- */}
      <div className="col-span-12" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wallet color="var(--accent-primary)" size={22}/> All Time Summary
        </h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-success)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Income</p>
        <h3 className="text-success" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(summary.totalIncome)}</h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-danger)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Expenses</p>
        <h3 className="text-danger" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(summary.totalExpenses)}</h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-info)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Net Savings</p>
        <h3 className="text-info" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(summary.netSavings)}</h3>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Savings Rate</p>
        <h3 className="gradient-text" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{savingsRate}%</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>of total income saved</p>
      </div>

      {/* --- 3. RECENT TRANSACTIONS --- */}
      <div className="col-span-12 glass-card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock color="var(--accent-primary)" size={20}/> Recent Transactions
        </h3>
        
        {summary.recentTransactions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No transactions found. Add your first record!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {summary.recentTransactions.map((tx, idx) => (
              <div key={idx} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', 
                borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    padding: '0.75rem', borderRadius: '50%'
                  }}>
                    {tx.type === 'income' ? <TrendingUp color="var(--accent-success)" size={20}/> : <TrendingDown color="var(--accent-danger)" size={20}/>}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>{tx.category || tx.source}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: tx.type === 'income' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
