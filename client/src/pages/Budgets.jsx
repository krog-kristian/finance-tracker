import { useEffect, useState, useContext, useCallback } from "react"
import AppContext from '../components/AppContext.jsx';

export default function Budgets() {
  const [budgets, setBudgets] = useState();
  const [totalsSpent, setTotalsSpent] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [previousMonth, setPreviousMonth] = useState();
  const { tokenKey } = useContext(AppContext);

  const getBudgets = useCallback(async () => {
    try {
    const token = localStorage.getItem(tokenKey);
    const res = await fetch('/api/records/budgets', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Could not load results ${res.status}`);
    const budgets = await res.json();
    return budgets;
    } catch (err) {
      console.error('RIP!!!!', err)
    }
  }, [tokenKey])

  useEffect(() => {
    const fetchBudgets = async () => {
      const {budgets, records, thisMonth, lastMonth} = await getBudgets();
      setBudgets(budgets);
      setTotalsSpent(records);
      setCurrentMonth(thisMonth);
      setPreviousMonth(lastMonth)
    };
    fetchBudgets();
  }, [getBudgets])

  console.log('budgets', budgets)
  console.log('totals', totalsSpent)
  console.log('current month', currentMonth)

  return (
    <h1>Budgets!</h1>
  )
}
