import { months } from "../lib/catergory-data.js";
import { formatBudgetData, combineBudgetTotals } from "../lib/dataSorting.js";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { categoriesOutObj } from "../lib/catergory-data.js";
import Button from "react-bootstrap/esm/Button.js";
import { useState, useContext, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import UserContext from './UserContext';

/**
 * Handles the functionality of the budget cards which are provided by a component that returns an array of cards.
 * Displays loading if data is not available yet.
 */
export function BudgetCards({ budgets, totalsSpent, currentMonth, previousMonth, setBudgets }) {
  const [editing, setEditing] = useState();
  const [goal, setGoal] = useState();
  const { token } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (Object.keys(budgets).length > 1) {
      setIsLoading(false)
    }
  }, [budgets])

  if (isLoading) return <h2 style={{ color: 'white' }}>Loading</h2>

  const budgetData = formatBudgetData(budgets, currentMonth, previousMonth)

  const cardData = combineBudgetTotals(budgetData, totalsSpent, currentMonth, previousMonth)

  function handleEdit(e, value) {
    setEditing(e.target.id)
    setGoal(value)
  }

  function handleCancel() {
    setEditing()
    setGoal()
  }

  function handleUpdate(key) {
    const updatedGoal = { category: key, amount: Number(goal).toFixed(2) }
    setEditing()
    setGoal()
    setBudgets({ ...budgets, [key]: Number(goal).toFixed(2) })
    sendUpdatedGoal(updatedGoal)
  }

  async function sendUpdatedGoal(goal) {
    try {
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
      console.err('Could not update', err)
    }
  }

  return (
    <BudgetCard obj={cardData} currentMonth={currentMonth} previousMonth={previousMonth} onEdit={handleEdit} editing={editing} onCancel={handleCancel} onUpdate={handleUpdate} setGoal={setGoal} goal={goal} />
  )
}

/**
 * Creates an array of budget cards with the data provided from a cardData object.
 */
function BudgetCard({ obj, onEdit, editing, onCancel, onUpdate, setGoal, goal, currentMonth, previousMonth }) {

  const monthNow = months[currentMonth].name;
  const lastMonth = months[previousMonth].name;

  const cards = [];

  for (const [key, value] of Object.entries(obj)) {

    cards.push(
      <Col className="d-flex justify-content-start" key={key}>
        <Card style={{ width: '18rem' }} className='mx-auto my-3 border border-dark border-1'>
          <Card.Header className="bg-secondary text-light fs-5">{categoriesOutObj[key]}</Card.Header>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {editing !== key ?
                <EditGoal onEdit={onEdit} category={key} value={value} /> :
                <GoalEditInput onCancel={onCancel} category={key} value={value} setGoal={setGoal} onUpdate={onUpdate} />}
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


/**
 * The default display of a budget goal with a button to enter editing mode.
 */
function EditGoal({ onEdit, category, value }) {

  return (
    <p className='my-0 ms-4'>Goal: ${Number(value.goal).toFixed(2)}
      <Button className="btn-sm ms-2 mr-0 py-0" id={category} onClick={(e) => onEdit(e, value.goal)}>Edit</Button>
    </p>
  )
}

/**
 * Creates an input component when editing a budget card.
 */
function GoalEditInput({ onCancel, category, value, setGoal, onUpdate}) {

  return (
    <InputGroup>
      <InputGroup.Text >$</InputGroup.Text>
      <Form.Control type='number' step={0.01} name='search' placeholder={Number(value.goal).toFixed(2)} onChange={e => setGoal(e.target.value)} />
      <Button className="btn-sm" variant="outline-success" name='search' onClick={() => onUpdate(category)}>Update</Button>
      <Button className="btn-sm" variant="outline-danger" name='cancel' onClick={onCancel}>Cancel</Button>
    </InputGroup>
  )
}
