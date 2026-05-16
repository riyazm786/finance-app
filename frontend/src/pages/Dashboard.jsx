import { useFinance } from '../context/FinanceContext';
import { IndianRupee, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { totalIncome, totalExpense, savings } = useFinance();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="grid">
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h2>Financial Dashboard</h2>
      </div>

      <div className="grid grid-cols-3">
        {/* Metric 1: Total Income */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
          <div className="flex-between">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Income</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{formatCurrency(totalIncome)}</h3>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }}>
              <TrendingUp color="var(--accent-success)" size={24} />
            </div>
          </div>
        </div>

        {/* Metric 2: Total Expense */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
          <div className="flex-between">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Expenses</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{formatCurrency(totalExpense)}</h3>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
              <TrendingDown color="var(--accent-danger)" size={24} />
            </div>
          </div>
        </div>

        {/* Metric 3: Savings */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <div className="flex-between">
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Net Savings</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{formatCurrency(savings)}</h3>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
              <Wallet color="var(--accent-primary)" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h3>Welcome to FinTrack</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Navigate to the 'Add Record' tab to start tracking your salary and expenses. Check out the 'Charts' tab for visual insights.
        </p>
      </div>
    </div>
  );
}
