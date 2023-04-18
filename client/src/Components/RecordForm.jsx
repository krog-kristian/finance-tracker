import CurrencyInput from 'react-currency-input-field';
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ItemForms } from './ItemsForms.jsx';

export default function RecordForm() {
  const [items, setItems] = useState(1);
  const [out, setOut] = useState(true);

  function handleItems (e) {
    const numberOfItems = e.target.value;
    setItems(numberOfItems);
  }

  async function handleSubmit (e) {

    try {
      e.preventDefault();
      const form = new FormData(e.target)
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
    <>
      <h1>New Record</h1>
      <form className='container-xl p-3' style={{ backgroundColor: '#595959', color: 'white'}} onSubmit={handleSubmit}>

      <div className='row g-3'>
        <div className='mb-3 col'>
              <label htmlFor="inOut" className="form-label">Select Type</label>
          <select className='form-select' required name="inOut" id="inOut" onChange={(e) => setOut(!out)}>
            <option value={true}>Money Out</option>
            <option value={false}>Money In</option>
          </select>
        </div>

        <div className='mb-3 col'>
              <label htmlFor="source" className="form-label">Source:</label>
              <input required type="text" id="source" name="source" className="form-control" />
        </div>
      </div>

      <div className='row g-3'>
        <div className='mb-3 col'>
              <label htmlFor="numberOfItems" className="form-label"># of Items</label>
              <input className="form-control" required type="number" name="numberOfItems" defaultValue={1} id="numberOfItems" min={1} max={20} onChange={(e) => handleItems(e)} />
        </div>

        <div className='mb-3 col'>
              <label htmlFor="total" className="form-label">Total $</label>
              <CurrencyInput className="form-control" required id='total' name='total' placeholder='Enter total $' decimalsLimit={2} onValueChange={(value, name) => console.log(value, name)} />
        </div>

        <div className='mb-3 col'>
              <label htmlFor="date" className="form-label">Date</label>
              <input required className="form-control" type="date" name="date" id="date" onChange={(e) => console.log('the date', e.target.value)}/>
        </div>
      </div>

        <Button size='lg' variant='success'>Save Record</Button>

      <ItemForms numberOfItems={items} out={out}/>

    </form>
    </>
  )
}
