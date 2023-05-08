import { useEffect, useState, useContext, useCallback } from "react"
import AppContext from '../components/AppContext.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { BudgetCards } from "../components/BudgetCards.jsx";

export default function Budgets() {
  const [budgets, setBudgets] = useState();
  const [totalsSpent, setTotalsSpent] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [previousMonth, setPreviousMonth] = useState();
  const { tokenKey, user } = useContext(AppContext);
  const [isError, setIsError] = useState(false)

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
      try{
      const {budgets, records, thisMonth, lastMonth} = await getBudgets();
      if (budgets.userId !== user.userId) throw new Error('Received wrong data.')
      delete budgets.userId;
      setBudgets(budgets);
      setTotalsSpent(records);
      setCurrentMonth(thisMonth);
      setPreviousMonth(lastMonth);
      } catch (err) {
        console.error(err);
        setIsError(true)
      }
    };
    fetchBudgets();
  }, [getBudgets, user])

  const errorMessage = <h3 style={{ color: 'white' }}>Error Loading.</h3>
  const loadingMessage = <h3 style={{ color: 'white' }}>LOADING!</h3>
  const tempMessage = isError ? errorMessage : loadingMessage

  return (
    <Container>
      <h1>Budgets</h1>
      <Row>
        {budgets ? <BudgetCards setBudgets={setBudgets} budgets={budgets} totalsSpent={totalsSpent} currentMonth={currentMonth} previousMonth={previousMonth}/> : tempMessage}
      </Row>
    </Container>
  )
}
