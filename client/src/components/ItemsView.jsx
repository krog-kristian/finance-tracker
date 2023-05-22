import Badge from 'react-bootstrap/Badge'
import { categoriesOutObj, categoriesInObj } from '../lib/catergory-data';

/**
 * Takes an array of items and creates a list component with their values.
 * @param {array} allRecords is an array of record objects.
 * @returns a jsx list of items.
 */
export default function ItemsView({ allRecords }) {
  const listItems = allRecords.map((r) => {
      return (
        <li className='list-group-item d-flex flex-wrap' key={r.itemId}>
          <div className='col'>
            <p className='my-auto text-start fs-4'>
              Source: {r.source}
            </p>
          </div>

          <div className='col'>
            <p className='my-auto text-start fs-5'>
              Item: {r.itemName}
            </p>
          </div>

          <div className='col'>
            <p className='my-auto text-start fs-6'>
              Category: {r.isDebit ? categoriesOutObj[r.category] : categoriesInObj[r.category]}
            </p>
          </div>

          <div className='col'>
            <Badge className='my-auto' style={r.isDebit ? { color: 'black' } : { color: 'white' }} bg={r.isDebit ? 'warning' : 'success'}>
              Total: ${Number(r.amount).toFixed(2)}
            </Badge>
          </div>

          <div className='col'>
            <p className='my-auto'>
              Date: {r.month + 1}/{r.day + 1}/{r.year}
            </p>
          </div>
        </li>)
      });

  return (
    <ul className='list-group'>
      {listItems}
    </ul>
  )
}
