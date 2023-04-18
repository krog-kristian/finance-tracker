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
      const response = await fetch('/api/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });
      if(!response.ok) throw new Error(`Server error: ${response.status}`)
      e.target.reset();
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <h1>New Record</h1>
      <form className='container-xl p-3' style={{ backgroundColor: '#595959', color: 'white'}} onReset={(e) => e.target.reset()} onSubmit={handleSubmit}>

      <div className='row g-3'>
        <div className='mb-3 col'>
          <label htmlFor='inOut' className='form-label'>Select Type</label>
          <select className='form-select' required name='inOut' id='inOut' onChange={(e) => setOut(!out)}>
            <option value={true}>Money Out</option>
            <option value={false}>Money In</option>
          </select>
        </div>

        <div className='mb-3 col'>
            <label htmlFor='source' className='form-label'>Source:</label>
            <input required type='text' id='source' name='source' className='form-control' placeholder='From where?' />
        </div>
      </div>

      <div className='row g-3'>
        <div className='mb-3 col'>
            <label htmlFor='numberOfItems' className='form-label'># of Items</label>
            <input className='form-control' required type='number' name='numberOfItems' defaultValue={1} id='numberOfItems' min={1} max={20} onChange={(e) => handleItems(e)} />
        </div>

        <div className='mb-3 col'>
            <label htmlFor='total' className='form-label'>Total $</label>
            <input type='number' placeholder='Total $' step={0.01} className='form-control' required id='total' name='total' />
        </div>

        <div className='mb-3 col'>
            <label htmlFor='date' className='form-label'>Date</label>
            <input required className='form-control' type='date' name='date' id='date' />
        </div>
      </div>
        <div className='d-flex justify-content-evenly'>

          <Button type='submit' size='lg' variant='success'>Save Record</Button>

          <Button type='reset' size='lg' variant='danger' style={{ whiteSpace: 'pre' }}>   Reset   </Button>

        </div>
      <ItemForms numberOfItems={items} out={out}/>

    </form>
    </>
  )
}
