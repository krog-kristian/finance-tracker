import { useEffect, useState, useContext, useCallback } from "react"
import AppContext from '../components/AppContext.jsx';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { months } from "../lib/dataSorting.js";

export default function Budgets() {
  const [budgets, setBudgets] = useState();
  const [totalsSpent, setTotalsSpent] = useState();
  const [currentMonth, setCurrentMonth] = useState();
  const [previousMonth, setPreviousMonth] = useState();
  const { tokenKey, user } = useContext(AppContext);

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
      }
    };
    fetchBudgets();
  }, [getBudgets, user])

  console.log('budgets', budgets)
  console.log('totals', totalsSpent)
  console.log('current month', currentMonth)

  return (
    <Container>
      <h1>Budgets!</h1>
      <Row>
        {budgets ? <BudgetCards budgets={budgets} totalsSpent={totalsSpent} currentMonth={currentMonth} previousMonth={previousMonth}/> : <h2>LOADING!</h2>}
      </Row>
    </Container>
  )
}

function BudgetCards({ budgets, totalsSpent, currentMonth, previousMonth }) {
  console.log('the budgets', budgets)
  console.log('totals isss', totalsSpent)
  const monthNow = months[currentMonth].name;
  const lastMonth = months[previousMonth].name;
  console.log('month now', monthNow)

  const cardData = {}
  for (const [key, value] of Object.entries(budgets)) {
    cardData[key] = {
      goal: value,
      [monthNow]: 0,
      [lastMonth]: 0
    }
  }

  for (let i = 0; i < totalsSpent.length; i++) {
    const month = currentMonth === totalsSpent[i].month ? monthNow : lastMonth;
    console.log('the month in loop', month)
    cardData[totalsSpent[i].category][month] = totalsSpent[i].totalSpent;
  }

  function makeCards(obj) {
    const cards = [];
    for (const [key, value] of Object.entries(obj)) {
    cards.push(
      <Col className="d-flex justify-content-start">
        <Card style={{ width: '18rem' }} className='mx-auto my-3'>
          <Card.Header>{key}</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>Goal: {value.goal}</ListGroup.Item>
            <ListGroup.Item>{monthNow} spending was {value[monthNow]}</ListGroup.Item>
            <ListGroup.Item>{lastMonth} spending was {value[lastMonth]}</ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    )
  }
  return cards;
}
const cards = makeCards(cardData);

  console.log("creating card Data", cardData);
  return (
    <>
      {cards}
    </>
  )
}
