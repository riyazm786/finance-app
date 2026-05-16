import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2 } from 'lucide-react';

export default function History() {
  const { expenses, deleteExpense } = useFinance();
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    let match = true;
    if (filterMonth) {
      match = match && expense.date.startsWith(filterMonth);
    }
    if (filterCategory) {
      match = match && expense.category === filterCategory;
    }
    return match;
  });

  return (
    <div className="glass-card">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2>Expense History</h2>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="input-group" 
            style={{ marginBottom: 0 }} 
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {/* Simple month generation for current year */}
            {Array.from({ length: 12 }).map((_, i) => {
              const month = `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`;
              return <option key={month} value={month}>{new Date(new Date().getFullYear(), i).toLocaleString('default', { month: 'long', year: 'numeric' })}</option>
            })}
          </select>

          <select 
            className="input-group" 
            style={{ marginBottom: 0 }} 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Food">Food & Dining</option>
            <option value="Rent">Rent & Utilities</option>
            <option value="Transport">Transportation</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No expenses found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map(expense => (
                <tr key={expense.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>{expense.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      background: 'rgba(99, 102, 241, 0.2)', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.875rem'
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{expense.description || '-'}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{expense.amount}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
