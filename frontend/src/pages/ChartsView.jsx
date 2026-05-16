import { useFinance } from '../context/FinanceContext';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ChartsView() {
  const { expenses } = useFinance();

  // Process data for Pie Chart (Expense Breakdown)
  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + parseFloat(exp.amount);
  });

  const pieData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)', // Indigo
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(245, 158, 11, 0.8)', // Amber
          'rgba(239, 68, 68, 0.8)',  // Rose
          'rgba(139, 92, 246, 0.8)', // Violet
          'rgba(148, 163, 184, 0.8)', // Slate
        ],
        borderWidth: 1,
        borderColor: '#1e293b' // Match background for a clean look
      },
    ],
  };

  // Process data for Bar Chart (Monthly Trend)
  const monthlyData = {};
  expenses.forEach(exp => {
    const month = exp.date.substring(0, 7); // 'YYYY-MM'
    monthlyData[month] = (monthlyData[month] || 0) + parseFloat(exp.amount);
  });

  // Sort months
  const sortedMonths = Object.keys(monthlyData).sort();
  
  const barData = {
    labels: sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: sortedMonths.map(m => monthlyData[m]),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#f8fafc' // text-primary
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#f8fafc'
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="glass-card" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Expense Breakdown</h3>
        {expenses.length > 0 ? (
          <div style={{ height: '300px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>No expenses logged yet.</p>
        )}
      </div>

      <div className="glass-card" style={{ height: '400px' }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Monthly Trend</h3>
        {sortedMonths.length > 0 ? (
          <div style={{ height: '300px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>No expenses logged yet.</p>
        )}
      </div>
    </div>
  );
}
