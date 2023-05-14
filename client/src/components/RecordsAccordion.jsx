import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge'
import Button from "react-bootstrap/esm/Button.js";
import Card from 'react-bootstrap/Card';

import { useAccordionButton } from 'react-bootstrap/AccordionButton';

/**
 * Creates the accordion items.
 * @param {array} records object to fill in content of an accordion items.
 * @returns an array of accordion items.
 */
export default function RecordsAccordion({ records, onDelete }) {

  /**
   * Toggle button creates a bootstrap button component to toggle open an accordion.
   * @param {number} eventKey, number  index of the attached accordion.
   * @returns A custom button component for use in the accordion.
   */
  function ToggleButton({ eventKey, children }) {
    const handleToggleOpen = useAccordionButton(eventKey);
    return <Button onClick={handleToggleOpen}>{children}</Button>
  }

  const recordItems = records.map((r, i) => (
        <Accordion.Item key={r.recordId} eventKey={i}>

          <Card.Header className='p-2 d-flex flex-wrap justify-content-between'>

          <Button onClick={() => onDelete(r.recordId, i)} className='me-2 px-3' size='sm' variant='danger'>X</Button>

              <h3 className='col my-auto mx-1'>Source: {r.source}</h3>

              <div className='col my-auto'>
                <Badge className='my-auto mx-1' style={r.isDebit ? { color: 'black' } : { color: 'white' }} bg={r.isDebit ? 'warning' : 'success'}>
                  Total: ${Number(r.totalSpent).toFixed(2)}
                </Badge>
              </div>

              <p className='col-2 me-3 ms-1 my-auto'>Date: {r.month + 1}/{r.day + 1}/{r.year}</p>

              <ToggleButton eventKey={i}>View Items</ToggleButton>

          </Card.Header>

          <Accordion.Body className='bg-secondary border border-secondary rounded'>
              <AccordionItems items={r.items} />
          </Accordion.Body>

        </Accordion.Item>
      )
    )
  return (
    <Accordion defaultActiveKey="0" alwaysOpen>
      {recordItems}
    </Accordion>
  )
}

/**
 * Takes an array of items to create a list as content of an accordion.
 * @param {array} items array for each record.
 * @returns an array of list items for individual accodion items content.
 */
function AccordionItems({ items }) {

    const itemsList = items.map((item, index) => (
        <li className='list-group-item' key={item.itemId}>
          <div className='d-flex flex-wrap justify-content-between w-100 align-items-center'>
            <h4 className='col mx-1 my-auto text-start'>Item: {item.itemName}</h4>
            <p className='col mx-1 fs-4 text-start my-auto'>Category: {item.category}</p>
            <div className='col d-flex justify-content-end'>
              <Badge className='text-dark my-auto mx-1' bg='info'>Amount: ${Number(item.amount).toFixed(2)}</Badge>
            </div>
          </div>
        </li>)
    );

  return <ul className='list-group'>{itemsList}</ul>

}
