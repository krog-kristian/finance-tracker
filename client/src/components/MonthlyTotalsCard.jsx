import Card from 'react-bootstrap/Card'
import Badge from "react-bootstrap/esm/Badge";

export default function MonthlyTotalsCard({ monthlyTotals }) {
  console.log('inside card', monthlyTotals);
  return (
    <Card className="text-center">
      <Card.Header>This Month's Totals</Card.Header>
      <Card.Body className="px-5">
        <Card.Title className="fs-1">{`${monthlyTotals.thisMonth}`}</Card.Title>
        <Card.Text>
          <Badge bg="warning" text="dark" className="p-3 m-3 fs-2">{`${monthlyTotals.totals.thisMonthsDebits}`}</Badge>
          <Badge bg="success" className="p-3 m-3 fs-2">{`${monthlyTotals.totals.thisMonthsCredits}`}</Badge>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">Last Month's Totals</Card.Footer>
      <Card.Body>
        <Card.Title className="fs-1">{`${monthlyTotals.lastMonth}`}</Card.Title>
        <Card.Text>
          <Badge bg="warning" text="dark" className="p-3 m-3 fs-2">{`${monthlyTotals.totals.lastMonthsDebits}`}</Badge>
          <Badge bg="success" className="p-3 m-3 fs-2">{`${monthlyTotals.totals.lastMonthsCredits}`}</Badge>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
