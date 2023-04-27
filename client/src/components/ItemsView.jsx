import Badge from 'react-bootstrap/Badge'
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
            <h3 className='my-auto mx-1 text-start'>
              Source: {r.source}
            </h3>
          </div>

          <div className='col'>
            <h4 className='my-auto flex-grow-1 mx-1 text-start'>
              Item: {r.itemname}
            </h4>
          </div>

          <div className='col'>
            <Badge className='my-auto mx-1' style={r.isDebit ? { color: 'black' } : { color: 'white' }} bg={r.isDebit ? 'warning' : 'success'}>
              Total: ${Number(r.amount).toFixed(2)}
            </Badge>
          </div>

          <div className='col'>
            <p className='mx-2 my-auto'>
              Date: {`${r.month + 1}/${r.day + 1}/${r.year}`}
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
