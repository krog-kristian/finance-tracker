import { months } from "../lib/catergory-data.js";
import { formatBudgetData, combineBudgetTotals } from "../lib/dataSorting.js";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { categoriesOutObj } from "../lib/catergory-data.js";
import Button from "react-bootstrap/esm/Button.js";
import { useState, useContext } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import AppContext from '../components/AppContext.jsx';

export function BudgetCards({ budgets, totalsSpent, currentMonth, previousMonth, setBudgets }) {
  const [editing, setEditing] = useState();
  const [goal, setGoal] = useState();
  const { tokenKey } = useContext(AppContext);

  const budgetData = formatBudgetData(budgets, currentMonth, previousMonth)

  const cardData = combineBudgetTotals(budgetData, totalsSpent, currentMonth, previousMonth)

  function handleEdit(e, value) {
    setEditing(e.target.id)
    setGoal(value)
  }

  function cancelEdit() {
    setEditing()
    setGoal()
  }

  function updateGoal(key) {
    const updatedGoal = { category: key, amount: Number(goal).toFixed(2) }
    setEditing()
    setGoal()
    setBudgets({ ...budgets, [key]: Number(goal).toFixed(2) })
    sendUpdatedGoal(updatedGoal)
  }

  async function sendUpdatedGoal(goal) {
    try {
      const token = localStorage.getItem(tokenKey);
      const res = await fetch('/api/records/budgets/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goal)
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
    } catch (err) {
      console.err('could not update', err)
    }
  }



  function makeCards(obj, handleEdit, editing, cancelEdit, updateGoal, setGoal, goal) {

    const monthNow = months[currentMonth].name;
    const lastMonth = months[previousMonth].name;

    const cards = [];

    for (const [key, value] of Object.entries(obj)) {

      const goalDisplay = <>Goal: ${Number(value.goal).toFixed(2)}<Button id={key} onClick={(e) => handleEdit(e, value.goal)}>Edit</Button></>;

      const editInput = <InputGroup><Form.Control type='number' step={0.01} name='search' id='search' placeholder={`$${Number(value.goal).toFixed(2)}`} onChange={e => setGoal(e.target.value)} /><Button variant="outline-secondary" name='search' onClick={() => updateGoal(key)}>Update</Button><Button variant="outline-secondary" name='cancel'  onClick={cancelEdit}>Cancel</Button></InputGroup>

      cards.push(
        <Col className="d-flex justify-content-start" key={key}>
          <Card style={{ width: '18rem' }} className='mx-auto my-3'>
            <Card.Header>{categoriesOutObj[key]}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {editing !== key ? goalDisplay : editInput}
              </ListGroup.Item>
              <ListGroup.Item>{monthNow} spending was ${Number(value[currentMonth]).toFixed(2)}</ListGroup.Item>
              <ListGroup.Item>{lastMonth} spending was ${Number(value[previousMonth]).toFixed(2)}</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
    )
  }
  return cards;
}
const cards = makeCards(cardData, handleEdit, editing, cancelEdit, updateGoal, setGoal, goal);

  return (
    <>
      {cards}
    </>
  )
}
