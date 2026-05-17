import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecord from './pages/AddRecord';
import History from './pages/History';
import IncomePage from './pages/IncomePage';
import EMICalculator from './pages/EMICalculator';
import TaxCalculator from './pages/TaxCalculator';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <>
      <Navbar />
      <div className="container animate-fade-up">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddRecord />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/history" element={<History />} />
          <Route path="/emi" element={<EMICalculator />} />
          <Route path="/tax" element={<TaxCalculator />} />
          <Route path="/portfolio" element={<Portfolio />} />
          
          <Route path="/analytics" element={<Dashboard />} /> {/* Placeholder */}
          <Route path="/profile" element={<Login />} /> {/* Placeholder */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
