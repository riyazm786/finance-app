import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export default function AddRecord() {
  const { addIncome, addExpense } = useFinance();
  const [activeTab, setActiveTab] = useState('expense');
  
  // Form States
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    if (activeTab === 'expense') {
      addExpense({ amount, category, description, date });
    } else {
      addIncome({ amount, source: category, month: date, year: new Date(date).getFullYear() });
    }

    setAmount('');
    setCategory('');
    setDescription('');
    alert(`${activeTab === 'expense' ? 'Expense' : 'Income'} added successfully!`);
  };

  return (
    <div className="flex-center">
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'expense' ? 'btn-danger' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab('expense')}
          >
            Add Expense
          </button>
          <button 
            className={`btn ${activeTab === 'income' ? 'btn-success' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => setActiveTab('income')}
          >
            Add Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Amount (₹)</label>
            <input 
              type="number" 
              required 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 5000" 
            />
          </div>

          <div className="input-group">
            <label>{activeTab === 'expense' ? 'Category' : 'Source'}</label>
            {activeTab === 'expense' ? (
              <select required value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="Food">Food & Dining</option>
                <option value="Rent">Rent & Utilities</option>
                <option value="Transport">Transportation</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <select required value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select Source</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            )}
          </div>

          {activeTab === 'expense' && (
            <div className="input-group">
              <label>Description</label>
              <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional description" 
              />
            </div>
          )}

          <div className="input-group">
            <label>Date</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <button type="submit" className={`btn ${activeTab === 'expense' ? 'btn-danger' : 'btn-success'}`} style={{ width: '100%', marginTop: '1rem' }}>
            Save {activeTab === 'expense' ? 'Expense' : 'Income'}
          </button>
        </form>
      </div>
    </div>
  );
}
