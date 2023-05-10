import { useState, useContext } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { ItemsForm } from '../components/ItemsForm'
import Alert from 'react-bootstrap/Alert'
import UserContext from '../components/UserContext';

export default function RecordForm() {
  const [items, setItems] = useState(1);
  const [isDebit, setIsDebit] = useState(true);
  const [isError, setIsError] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const { token } = useContext(UserContext)

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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      });
      if(!response.ok) throw new Error(`Server error: ${response.status}`)
      setItems(1);
      e.target.reset();
      setIsDebit(true)
      setShowSuccessAlert(true)
      window.scrollTo(0, 0)
      setTimeout(() => {
        setShowSuccessAlert(false)
      }, 1500)
    } catch (err) {
      console.error(err)
      setIsError(true)
      window.scrollTo(0, 0)
      setTimeout(() => {
        setIsError(false)
      }, 2000)
    }
  }



  return (
    <>
      <h1>New Record</h1>
      <Alert show={isError} variant="danger"><Alert.Heading>Failure.</Alert.Heading><p>Could not add record.</p><hr /></Alert>
      <Alert show={showSuccessAlert} variant="success"><Alert.Heading>Success!</Alert.Heading><p>New record added.</p><hr /></Alert>
      <form className='container-xl p-5 rounded border border-dark bg-secondary text-white fs-4' onReset={(e) => e.target.reset()} onSubmit={handleSubmit}>

      <div className='row g-3'>
        <div className='mb-3 col'>
          <label className='form-label'>Select Type
            <select className='form-select' required name='isDebit' id='isDebit' onChange={(e) => setIsDebit((e) => !e)}>
              <option value={true}>Money Out</option>
              <option value={false}>Money In</option>
            </select>
          </label>
        </div>

        <div className='mb-3 col'>
          <label className='form-label'>Source
            <input required type='text' id='source' name='source' className='form-control' placeholder='From where?' />
          </label>
        </div>
      </div>

      <div className='row g-3'>
        <div className='mb-3 col'>
          <label className='form-label'># of Items
            <input className='form-control' required type='number' name='numberOfItems' defaultValue={1} id='numberOfItems' min={1} max={20} onChange={(e) => handleItems(e)} />
          </label>
        </div>

        <div className='mb-3 col'>
          <label className='form-label'>Total $
            <input type='number' placeholder='Total $' step={0.01} className='form-control' required id='total' name='total' />
          </label>
        </div>

        <div className='mb-3 col'>
          <label className='form-label'>Date
            <input required className='form-control' type='date' name='date' id='date'  />
          </label>
        </div>
      </div>

      <ItemsForm numberOfItems={items} isDebit={isDebit}/>
        <div className='d-flex justify-content-around flex-wrap'>

        <Button type='submit' size='lg' variant='success' className='my-2 m-5 mw-25'>Save Record</Button>

        <Button type='reset' size='lg' variant='danger' className='my-2 m-5 mw-25'>Reset</Button>

      </div>
    </form>
    </>
  )
}
