import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Wallet, PlusCircle, MinusCircle, 
  Activity, Target, ShieldCheck, Zap, Bell, Calendar, ChevronRight, MessageSquare
} from 'lucide-react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler);

export default function Dashboard() {
  const { totalIncome, totalExpense, savings, expenses, incomes } = useFinance();

  // AI Advisor Rotating Tips
  const [tipIndex, setTipIndex] = useState(0);
  const aiTips = [
    "💡 You spent ₹8,000 on food this month. Try to reduce by 20% to save ₹1,600.",
    "📈 You are saving 21% of income. Financial experts recommend 30%.",
    "🚀 Start a SIP of ₹2,000/month in index funds to build ₹8.7L in 10 years.",
    "🏠 Your biggest expense is Rent (42%). Consider house sharing to reduce costs."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % aiTips.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // MOCK Smart Widget Data
  const netWorth = 850000; // Assets - Liabilities
  const dailyLimit = 1500;
  const todaySpent = 850;
  const spendInsight = "+14%";
  
  // 50-30-20 Rule Calculations
  const needsBudget = totalIncome * 0.5 || 25000;
  const wantsBudget = totalIncome * 0.3 || 15000;
  const savingsBudget = totalIncome * 0.2 || 10000;

  // Approximate category splits for the rule
  const catTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const needsSpent = (catTotals['Rent'] || 0) + (catTotals['Food'] || 0);
  const wantsSpent = (catTotals['Shopping'] || 0) + (catTotals['Subscriptions'] || 0);
  const savingsActual = savings > 0 ? savings : 0;

  const getPercent = (spent, budget) => Math.min((spent / budget) * 100, 100);

  // Chart Data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Income', data: [40000, 42000, 45000, 45000, 48000, 50000], backgroundColor: '#10B981', borderRadius: 4 },
      { label: 'Expense', data: [25000, 28000, 24000, 30000, 26000, 29000], backgroundColor: '#EF4444', borderRadius: 4 }
    ]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false }, ticks: { color: '#94A3B8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } } }, plugins: { legend: { labels: { color: '#F8FAFC' } } } };

  return (
    <div className="dash-grid animate-fade-up">
      
      {/* Header */}
      <div className="col-span-12 flex-between" style={{ marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem' }}>Hello, Riyaz 👋</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Here is your financial briefing for today.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/add" className="btn btn-success"><PlusCircle size={18}/> Add Income</Link>
          <Link to="/add" className="btn btn-danger"><MinusCircle size={18}/> Add Expense</Link>
        </div>
      </div>

      {/* --- 1. AI FINANCIAL ADVISOR --- */}
      <div className="col-span-12">
        <div className="ai-advisor-box">
          <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%' }}>
            <MessageSquare color="var(--accent-primary)" size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Financial Advisor</p>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', marginTop: '0.25rem', transition: 'opacity 0.5s ease-in-out' }} key={tipIndex}>
              {aiTips[tipIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* --- 2. SMART WIDGETS (Row 1) --- */}
      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Net Worth</p>
        <h3 className="gradient-text" style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{formatCurrency(netWorth)}</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--accent-success)', marginTop: '0.5rem' }}>+2.4% vs last month</p>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-danger)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Spending Insight</p>
        <h3 className="text-danger" style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{spendInsight}</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>You spent 14% more than last month.</p>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-warning)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Daily Spending Limit</p>
        <h3 style={{ fontSize: '1.8rem', marginTop: '0.25rem', color: todaySpent > dailyLimit ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
          {formatCurrency(todaySpent)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {formatCurrency(dailyLimit)}</span>
        </h3>
        <div className="progress-bg" style={{ marginTop: '0.5rem' }}>
          <div className="progress-fill" style={{ width: `${getPercent(todaySpent, dailyLimit)}%`, background: todaySpent > dailyLimit ? 'var(--accent-danger)' : 'var(--accent-warning)' }}></div>
        </div>
      </div>

      <div className="col-span-3 glass-card" style={{ borderTop: '4px solid var(--accent-info)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Next Expected Hike</p>
        <h3 className="text-info" style={{ fontSize: '1.8rem', marginTop: '0.25rem', color: 'var(--accent-info)' }}>+12%</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Estimated based on industry avg.</p>
      </div>

      {/* --- 3. BUDGET PLANNER (50-30-20 RULE) --- */}
      <div className="col-span-8 glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target color="var(--accent-success)" size={22}/> 50-30-20 Budget Planner</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          
          {/* NEEDS */}
          <div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold' }}>Needs (50%)</span>
              <span className="text-danger">{formatCurrency(needsSpent)}</span>
            </div>
            <div className="progress-bg"><div className="progress-fill" style={{ width: `${getPercent(needsSpent, needsBudget)}%`, background: 'var(--accent-danger)' }}></div></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>Limit: {formatCurrency(needsBudget)}</p>
          </div>

          {/* WANTS */}
          <div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold' }}>Wants (30%)</span>
              <span className="text-warning" style={{ color: 'var(--accent-warning)' }}>{formatCurrency(wantsSpent)}</span>
            </div>
            <div className="progress-bg"><div className="progress-fill" style={{ width: `${getPercent(wantsSpent, wantsBudget)}%`, background: 'var(--accent-warning)' }}></div></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>Limit: {formatCurrency(wantsBudget)}</p>
          </div>

          {/* SAVINGS */}
          <div>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold' }}>Savings (20%)</span>
              <span className="text-success">{formatCurrency(savingsActual)}</span>
            </div>
            <div className="progress-bg"><div className="progress-fill" style={{ width: `${getPercent(savingsActual, savingsBudget)}%`, background: 'var(--accent-success)' }}></div></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>Goal: {formatCurrency(savingsBudget)}</p>
          </div>

        </div>
      </div>

      {/* --- 4. UPCOMING BILLS & EMIs --- */}
      <div className="col-span-4 glass-card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell color="var(--accent-warning)" size={20}/> Action Needed</h3>
        
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1rem' }}>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16}/> Car Loan EMI</span>
            <span style={{ fontWeight: 'bold' }}>{formatCurrency(8500)}</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Due in 3 days • 24 months left</p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div className="flex-between">
            <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={16}/> Electricity Bill</span>
            <span style={{ fontWeight: 'bold' }}>{formatCurrency(2100)}</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Due in 8 days</p>
        </div>
      </div>

      {/* --- 5. MONTHLY TREND CHART --- */}
      <div className="col-span-12 glass-card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity color="var(--accent-primary)" size={20}/> 6-Month Analytics</h3>
        <div style={{ height: '300px' }}>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
}
