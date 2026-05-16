import { useState } from 'react';
import { Calculator, CheckCircle } from 'lucide-react';

export default function TaxCalculator() {
  const [income, setIncome] = useState(1500000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [deductions80D, setDeductions80D] = useState(25000);
  const [hra, setHra] = useState(0);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Simplified Indian Tax Calculation (Mock logic for demonstration)
  // Old Regime (requires deductions)
  const taxableOld = Math.max(0, income - deductions80C - deductions80D - hra - 50000); // 50k standard deduction
  let taxOld = 0;
  if(taxableOld > 1000000) taxOld = 112500 + (taxableOld - 1000000) * 0.3;
  else if(taxableOld > 500000) taxOld = 12500 + (taxableOld - 500000) * 0.2;
  else if(taxableOld > 250000) taxOld = (taxableOld - 250000) * 0.05;
  if(taxableOld <= 500000) taxOld = 0; // Rebate 87A

  // New Regime (no deductions except 50k standard)
  const taxableNew = Math.max(0, income - 50000);
  let taxNew = 0;
  if(taxableNew > 1500000) taxNew = 150000 + (taxableNew - 1500000) * 0.3;
  else if(taxableNew > 1200000) taxNew = 90000 + (taxableNew - 1200000) * 0.2;
  else if(taxableNew > 900000) taxNew = 45000 + (taxableNew - 900000) * 0.15;
  else if(taxableNew > 600000) taxNew = 15000 + (taxableNew - 600000) * 0.1;
  else if(taxableNew > 300000) taxNew = (taxableNew - 300000) * 0.05;
  if(taxableNew <= 700000) taxNew = 0; // Rebate 87A

  // Add 4% cess
  taxOld = taxOld * 1.04;
  taxNew = taxNew * 1.04;

  const betterRegime = taxOld < taxNew ? 'Old Regime' : 'New Regime';
  const taxSaved = Math.abs(taxOld - taxNew);
  const effectiveRate = ((Math.min(taxOld, taxNew) / income) * 100).toFixed(1);

  return (
    <div className="dash-grid animate-fade-up">
      <div className="col-span-12">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calculator color="var(--accent-primary)"/> Tax Calculator (India)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Compare Old vs New Tax Regimes to maximize your take-home pay.</p>
      </div>

      <div className="col-span-4 glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Income & Deductions</h3>
        <div className="input-group">
          <label>Annual Income (₹)</label>
          <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>Sec 80C Deductions (Max 1.5L)</label>
          <input type="number" value={deductions80C} onChange={e => setDeductions80C(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>Sec 80D Health Insurance</label>
          <input type="number" value={deductions80D} onChange={e => setDeductions80D(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>HRA Exemption</label>
          <input type="number" value={hra} onChange={e => setHra(Number(e.target.value))} />
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>* Standard deduction of ₹50,000 is automatically applied to both regimes.</p>
      </div>

      <div className="col-span-8 glass-card">
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h3>Tax Comparison Analysis</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', color: 'var(--accent-success)' }}>
            <CheckCircle size={18}/> <strong>{betterRegime} is better for you!</strong>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: taxOld < taxNew ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: taxOld < taxNew ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Old Regime Tax</h4>
            <h2 className="text-danger" style={{ fontSize: '2.5rem' }}>{formatCurrency(taxOld)}</h2>
          </div>
          
          <div style={{ background: taxNew <= taxOld ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: taxNew <= taxOld ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>New Regime Tax</h4>
            <h2 className="text-danger" style={{ fontSize: '2.5rem' }}>{formatCurrency(taxNew)}</h2>
          </div>
        </div>

        <div className="flex-between" style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Potential Tax Savings</p>
            <h3 className="text-success">{formatCurrency(taxSaved)}</h3>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Effective Tax Rate</p>
            <h3>{effectiveRate}%</h3>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Net Take Home Pay</p>
            <h3 className="gradient-text">{formatCurrency(income - Math.min(taxOld, taxNew))}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
