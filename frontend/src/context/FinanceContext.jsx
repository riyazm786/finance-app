import { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('fin_incomes');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('fin_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fin_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('fin_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addIncome = (income) => {
    setIncomes([{ ...income, id: Date.now().toString() }, ...incomes]);
  };

  const addExpense = (expense) => {
    setExpenses([{ ...expense, id: Date.now().toString() }, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteIncome = (id) => {
    setIncomes(incomes.filter(i => i.id !== id));
  };

  const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const savings = totalIncome - totalExpense;

  return (
    <FinanceContext.Provider value={{
      incomes, expenses,
      addIncome, addExpense,
      deleteExpense, deleteIncome,
      totalIncome, totalExpense, savings
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => useContext(FinanceContext);
