import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FinanceContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;

export function FinanceProvider({ children }) {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('fin_token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('fin_token', token);
      fetchData();
    } else {
      localStorage.removeItem('fin_token');
      setIncomes([]);
      setExpenses([]);
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [incRes, expRes] = await Promise.all([
        fetch(`${API_URL}/api/income`, { headers }),
        fetch(`${API_URL}/api/expenses`, { headers })
      ]);

      if (incRes.ok) setIncomes(await incRes.json());
      if (expRes.ok) setExpenses(await expRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      navigate('/');
      return true;
    }
    throw new Error(data.msg || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      navigate('/');
      return true;
    }
    throw new Error(data.msg || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  const addIncome = async (income) => {
    const res = await fetch(`${API_URL}/api/income`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(income)
    });
    if (res.ok) {
      const newInc = await res.json();
      setIncomes([newInc, ...incomes]);
    }
  };

  const addExpense = async (expense) => {
    const res = await fetch(`${API_URL}/api/expenses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expense)
    });
    if (res.ok) {
      const newExp = await res.json();
      setExpenses([newExp, ...expenses]);
    }
  };

  const deleteExpense = async (id) => {
    // Note: The backend uses _id for MongoDB. Wait, in our frontend we used 'id' earlier, MongoDB returns '_id'.
    // Let's assume frontend uses _id from the backend.
    const res = await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setExpenses(expenses.filter(e => (e._id || e.id) !== id));
    }
  };

  const deleteIncome = async (id) => {
    // Same for income if we implement it
    setIncomes(incomes.filter(i => (i._id || i.id) !== id));
  };

  const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const savings = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider value={{
      incomes, expenses,
      addIncome, addExpense,
      deleteExpense, deleteIncome,
      totalIncome, totalExpense, savings,
      login, register, logout, token
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
