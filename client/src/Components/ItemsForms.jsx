export function ItemForms({ numberOfItems, out }) {

  const form = [];
  for (let i = 0; i < numberOfItems; i++) {
    form.push(
      <li key={i} className='container-l list-group-item m-2'>
        <div className='row g-3'>
          <div className='col'>
            <label className="form-label" htmlFor={`item${i}`}>{`Item #${i + 1}`}</label>
            <input required className="form-control" type="text" name={`item${i}`} id={`item${i}`} />
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <label className="form-label" htmlFor={`itemCat${i}`}>Catergory</label>
            <select className='form-select' name={`itemCat${i}`} id={`itemCat${i}`}>
              <CreateOptions out={out} />
            </select>
          </div>

          <div className='col'>
            <label className="form-label" htmlFor={`itemAmt${i}`}>Amount</label>
            <input type='number' className="form-control" required id={`itemAmt${i}`} name={`itemAmt${i}`} placeholder='Amount $' step={0.01} />
          </div>
        </div>

      </li>)
  }

  return (
    <ul className='list-group'>{form}</ul>
  )
}

export function CreateOptions({ out }) {
  const categoriesOut = ['misc', 'food', 'clothes', 'fast-food', 'cleaning', 'toiletries', 'furniture', 'gas', 'utilities', 'rent', 'subscriptions', 'lending']
  const categoriesIn = ['misc', 'salary', 'interest', 'dividends', 'investment', 'refund', 'gift', 'repayment']
  return (out ? categoriesOut.map((o) => <option key={o} value={o}>{o}</option>) : categoriesIn.map((o) => <option key={o} value={o}>{o}</option>));
}
