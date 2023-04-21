import Card from 'react-bootstrap/Card'
import Badge from "react-bootstrap/esm/Badge";

/**
 * Takes the monthly totals and renders a card with the info.
 * @param {object} monthlyTotals object with 3 properties totals, thisMonth, lastMonth.
 * @returns a card component.
 */
export default function MonthlyTotalsCard({ monthlyTotals }) {

  return (
    <Card className="text-center" bg='light'>
      <Card.Header>This Month's Totals</Card.Header>
      <Card.Body className="px-5">
        <Card.Title className="fs-1">{`${monthlyTotals.thisMonth}`}</Card.Title>
        <Card.Text className='d-flex flex-wrap justify-content-center'>
          <Badge bg="warning" text="dark" className="p-3 m-3 fs-2">{`Total Debits: $${monthlyTotals.totals.thisMonthsDebits}`}</Badge>
          <Badge bg="success" className="p-3 m-3 fs-2">{`Total Credits: $${monthlyTotals.totals.thisMonthsCredits}`}</Badge>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">Last Month's Totals</Card.Footer>
      <Card.Body>
        <Card.Title className="fs-1">{`${monthlyTotals.lastMonth}`}</Card.Title>
        <Card.Text className='d-flex flex-wrap justify-content-center'>
          <Badge bg="warning" text="dark" className="p-3 m-3 fs-2">{`Total Debits: $${monthlyTotals.totals.lastMonthsDebits}`}</Badge>
          <Badge bg="success" className="p-3 m-3 fs-2">{`Total Credits: $${monthlyTotals.totals.lastMonthsCredits}`}</Badge>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
