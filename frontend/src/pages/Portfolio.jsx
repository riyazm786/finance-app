import { useState } from 'react';
import { Briefcase, TrendingUp } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';

export default function Portfolio() {
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Mock Portfolio Data
  const [investments, setInvestments] = useState([
    { id: 1, name: 'Nifty 50 Index Fund', type: 'Mutual Fund', invested: 150000, current: 185000 },
    { id: 2, name: 'Reliance Industries', type: 'Stock', invested: 50000, current: 62000 },
    { id: 3, name: 'Sovereign Gold Bond', type: 'Gold', invested: 100000, current: 115000 },
    { id: 4, name: 'HDFC Fixed Deposit', type: 'FD', invested: 200000, current: 214000 }
  ]);

  const totalInvested = investments.reduce((acc, curr) => acc + curr.invested, 0);
  const totalCurrent = investments.reduce((acc, curr) => acc + curr.current, 0);
  const absoluteReturn = totalCurrent - totalInvested;
  const returnPercentage = ((absoluteReturn / totalInvested) * 100).toFixed(1);

  const allocData = {
    labels: investments.map(i => i.type),
    datasets: [{
      data: investments.map(i => i.current),
      backgroundColor: ['#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'],
      borderWidth: 0, hoverOffset: 4
    }]
  };

  return (
    <div className="dash-grid animate-fade-up">
      <div className="col-span-12">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase color="var(--accent-primary)"/> Investment Portfolio</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track your wealth growth across different asset classes.</p>
      </div>

      <div className="col-span-12 glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Current Value</p>
          <h2 className="gradient-text" style={{ fontSize: '2rem' }}>{formatCurrency(totalCurrent)}</h2>
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Total Invested</p>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{formatCurrency(totalInvested)}</h2>
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Absolute Return</p>
          <h2 className="text-success" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>+{formatCurrency(absoluteReturn)}</h2>
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Return %</p>
          <h2 className="text-success" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>+{returnPercentage}%</h2>
        </div>
      </div>

      <div className="col-span-8 glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Your Holdings</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem' }}>Asset Name</th>
              <th style={{ padding: '1rem' }}>Type</th>
              <th style={{ padding: '1rem' }}>Invested</th>
              <th style={{ padding: '1rem' }}>Current Val</th>
              <th style={{ padding: '1rem' }}>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {investments.map(inv => {
              const gain = inv.current - inv.invested;
              const gainPct = ((gain/inv.invested)*100).toFixed(1);
              return (
                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.name}</td>
                  <td style={{ padding: '1rem' }}><span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-primary)' }}>{inv.type}</span></td>
                  <td style={{ padding: '1rem' }}>{formatCurrency(inv.invested)}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{formatCurrency(inv.current)}</td>
                  <td style={{ padding: '1rem', color: gain >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {gain >= 0 ? '+' : ''}{formatCurrency(gain)} ({gainPct}%)
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="col-span-4 glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Asset Allocation</h3>
        <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
          <Doughnut data={allocData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#f8fafc' } } }, cutout: '75%' }} />
        </div>
      </div>
    </div>
  );
}
