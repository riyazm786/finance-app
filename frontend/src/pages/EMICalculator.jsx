import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Landmark, IndianRupee, Calculator, ChevronRight } from 'lucide-react';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(60);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Math
  const r = (interestRate / 12) / 100;
  const n = tenureMonths;
  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  if (r > 0 && n > 0 && loanAmount > 0) {
    emi = loanAmount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    totalPayment = emi * n;
    totalInterest = totalPayment - loanAmount;
  }

  // Amortization Schedule (first 6 months)
  const schedule = [];
  let remainingBal = loanAmount;
  for(let i=1; i<=Math.min(n, 6); i++) {
    const interestPmt = remainingBal * r;
    const principalPmt = emi - interestPmt;
    remainingBal -= principalPmt;
    schedule.push({ month: i, principal: principalPmt, interest: interestPmt, balance: Math.max(0, remainingBal) });
  }

  return (
    <div className="dash-grid animate-fade-up">
      <div className="col-span-12">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Landmark color="var(--accent-primary)"/> EMI & Loan Calculator</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Plan your loans and mortgages with exact precision.</p>
      </div>

      <div className="col-span-4 glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Loan Details</h3>
        <div className="input-group">
          <label>Loan Amount (₹)</label>
          <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>Interest Rate (% p.a.)</label>
          <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>Tenure (Months)</label>
          <input type="number" value={tenureMonths} onChange={e => setTenureMonths(Number(e.target.value))} />
        </div>
      </div>

      <div className="col-span-8 glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Monthly EMI</p>
            <h2 className="gradient-text" style={{ fontSize: '2rem' }}>{formatCurrency(emi)}</h2>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Interest</p>
            <h2 className="text-danger" style={{ fontSize: '1.5rem' }}>{formatCurrency(totalInterest)}</h2>
          </div>
          <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Amount</p>
            <h2 className="text-success" style={{ fontSize: '1.5rem' }}>{formatCurrency(totalPayment)}</h2>
          </div>
        </div>

        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Amortization Schedule (First 6 Months)</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem' }}>Month</th>
                <th style={{ padding: '0.75rem' }}>Principal</th>
                <th style={{ padding: '0.75rem' }}>Interest</th>
                <th style={{ padding: '0.75rem' }}>Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(row => (
                <tr key={row.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem' }}>{row.month}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-success)' }}>{formatCurrency(row.principal)}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--accent-danger)' }}>{formatCurrency(row.interest)}</td>
                  <td style={{ padding: '0.75rem' }}>{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
