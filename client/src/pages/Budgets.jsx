import { useEffect, useState, useCallback } from "react"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { BudgetCards } from "../components/BudgetCards.jsx";
import { useUserContext } from "../components/UserContext"

export default function Budgets() {
  const [budgets, setBudgets] = useState();
  const [totalsSpent, setTotalsSpent] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [previousMonth, setPreviousMonth] = useState();
  const { token, user } = useUserContext()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState()

  const getBudgets = useCallback(async () => {
    try {
    const res = await fetch('/api/records/budgets', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`Could not load results ${res.status}`);
    const budgets = await res.json();
    return budgets;
    } catch (err) {
      console.error('Could not retrieve users.11111', err)
    }
  }, [token])



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
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (isLoading) fetchBudgets();
    if (isLoading === undefined) setIsLoading(true)
  }, [getBudgets, user, isLoading])

  if (isError) return <h3 style={{ color: 'white' }}>Error Loading.</h3>
  if (isLoading || isLoading === undefined) return <h3 style={{ color: 'white' }}>LOADING!</h3>

  return (
    <Container>
      <h1>Budgets</h1>
      <Row>
        <BudgetCards setBudgets={setBudgets} budgets={budgets} totalsSpent={totalsSpent} currentMonth={currentMonth} previousMonth={previousMonth}/>
      </Row>
    </Container>
  )
}
