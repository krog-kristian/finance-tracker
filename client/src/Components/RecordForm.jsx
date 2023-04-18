import CurrencyInput from 'react-currency-input-field';
import { useState } from 'react';

export default function RecordForm() {
  const [items, setItems] = useState(1);

  function handleItems (e) {
    const numberOfItems = e.target.value;
    setItems(numberOfItems);
  }

  async function handleSubmit (e) {

    try {
      e.preventDefault();
      console.log('the form', e.target[0].value)
      const form = new FormData(e.target)
      for (const pair of form.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
      }
      const response = await fetch('/getsome/fires/record', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });
      if(!response.ok) throw new Error(`Server error: ${response.status}`)
      const responseBody = await response.json();
      console.log('Success form sent', responseBody);
    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div>
      <h1>New Record</h1>
    <form style={{backgroundColor: 'gray', color: 'black'}} onSubmit={handleSubmit}>

    <div>
      <label htmlFor="inOut">Select Type</label>
      <select required name="inOut" id="inOut">
        <option value={true}>Money Out</option>
        <option value={false}>Money In</option>
      </select>
    </div>

    <div>
      <label htmlFor="source">Source:</label>
      <input required type="text" id="source" name="source" />
    </div>

    <div>
      <label htmlFor="numberOfItems"># of Items</label>
      <input required type="number" name="numberOfItems" defaultValue={1} id="numberOfItems" min={1} max={20} onChange={(e) => handleItems(e)} />
    </div>

    <div>
      <label htmlFor="total">Total $</label>
      <CurrencyInput required id='total' name='total' placeholder='Enter total $' decimalsLimit={2} onValueChange={(value, name) => console.log(value, name)} />
    </div>

    <div>
      <label htmlFor="date">Date</label>
      <input type="date" name="date" id="date" onChange={(e) => console.log('the date', e.target.value)}/>
    </div>

    <div>
      <button type='submit'>Submit</button>
    </div>
    <ItemForms numberOfItems={items}/>
    </form>
    </div>
  )
}

function ItemForms({ numberOfItems }) {
  const form = [];
  for (let i = 0; i < numberOfItems; i++){
    form.push(
    <li key={i}>
      <div>
        <label htmlFor={`item${i}`}>{`Item #${i + 1}`}</label>
        <input type="text" name={`item${i}`} id={`item${i}`} />
      </div>

      <div>
          <label htmlFor={`itemCat${i}`}>Catergory</label>
          <select name={`itemCat${i}`} id={`itemCat${i}`}>
            <option value='food'>Food</option>
            <option value='clothes'>Clothes</option>
          </select>
      </div>

      <div>
          <label htmlFor={`itemAmt${i}`}>Amount</label>
          <CurrencyInput required id={`itemAmt${i}`} name={`itemAmt${i}`} placeholder='Amount $' decimalsLimit={2} />
      </div>
    </li>)
  }

  return (
    <ul>{form}</ul>
  )
}
