import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge'

/**
 * Creates the accordion items.
 * @param {array} records object to fill in content of an accordion items.
 * @returns an array of accordion items.
 */
export default function AccordionItems({ records }) {
  return (
    records.map((r, i) => {
      return (
        <Accordion.Item key={`${r.recordId}`} eventKey={i}>

          <Accordion.Header>
            <div className='d-flex w-100'>

              <h3 className='my-auto flex-grow-1 mx-1'>Source: {r.source}</h3>

              <div className='my-auto'>
                <Badge className='my-auto mx-1' style={r.isDebit ? { color: 'black' } : { color: 'white' }} bg={r.isDebit ? 'warning' : 'success'}>
                  Total: ${Number(r.totalSpent).toFixed(2)}
                </Badge>
              </div>

              <p className='mx-2 my-auto'>Date: {`${r.month + 1}/${r.day + 1}/${r.year}`}</p>
            </div>
          </Accordion.Header>

          <Accordion.Body className='bg-secondary border border-secondary rounded'>
            <ul className='list-group'>
              <AccordionDropdown items={r.items} />
            </ul>
          </Accordion.Body>

        </Accordion.Item>
      )
    })
  )
}

/**
 * Takes an array of items to create a list as content of an accordion.
 * @param {array} items array for each record.
 * @returns an array of list items for individual accodion items content.
 */
function AccordionDropdown({ items }) {
  return (
    items.map((item, index) => {
      return (
        <li className='list-group-item' key={item.itemId}>
          <div className='d-flex w-100 align-items-center'>
            <h4 className='mx-1 my-auto flex-grow-1 text-start'>Item: {item.itemName}</h4>
            <p className='mx-1 fs-4 my-auto'>Category: {item.category}</p>
            <div>
              <Badge className='text-dark my-auto mx-1' bg='info'>Amount: ${Number(item.amount).toFixed(2)}</Badge>
            </div>
          </div>
        </li>)
    })
  );
}
