import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddRecord from './pages/AddRecord';
import History from './pages/History';
import ChartsView from './pages/ChartsView';

function App() {
  return (
    <>
      <Navbar />
      <div className="container page-enter-active">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddRecord />} />
          <Route path="/history" element={<History />} />
          <Route path="/charts" element={<ChartsView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
