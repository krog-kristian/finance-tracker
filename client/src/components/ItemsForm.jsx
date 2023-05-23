import { categoriesOut, categoriesIn } from '../lib/catergory-data.js';

/**
 * Creates an item for depending on the number of items in a given record.
 * @param {number, boolean} numberOfItems representing the number of forms, isDebit to decide the category dropdown content.
 * @returns An array of record forms.
 */
export function ItemsForm({ numberOfItems, isDebit }) {

  const items = [];
  for (let i = 0; i < numberOfItems; i++) {
    items.push(
      <li key={i} className='container-l list-group-item m-2'>
        <div className='row g-3'>
          <div className='col'>
            <label className='form-label'>Item #{i + 1}
              <input required className='form-control' type='text' name={`item${i}`} placeholder='What?'/>
            </label>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <label className='form-label'>Category
              <select className='form-select' name={`itemCat${i}`}>
                <CreateOptions isDebit={isDebit} />
              </select>
            </label>
          </div>

          <div className='col'>
            <label className='form-label'>Amount
              <input type='number' className='form-control' required name={`itemAmt${i}`} placeholder='Amount $' step={0.01} />
            </label>
          </div>
        </div>

      </li>)
  }

  return (
    <ul className='list-group'>{items}</ul>
  )
}

/**
 * Maps an array of objects with their values and category name to option elements.
 * @param {boolean} isDebit represents whether the form is outgoing or incoming money.
 * @returns array of option elements.
 */
function CreateOptions({ isDebit }) {
  const debitOptions = categoriesOut.map((cat) => <option key={cat.value} value={cat.value}>{cat.category}</option>)
  const creditOptions = categoriesIn.map((cat) => <option key={cat.value} value={cat.value}>{cat.category}</option>)
  return isDebit ? debitOptions : creditOptions
}
