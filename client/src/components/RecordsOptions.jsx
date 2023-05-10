import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { categoriesOut, categoriesIn } from '../lib/catergory-data';
import { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';

/**
 * Creates and option bar for different filtering options.
 * @returns a component with multiple input fields.
 */
export default function RecordsOptions({values, handleItemView, handleChange, startSearch, search, setSearch }) {
  const [disableButton, setDisableButton] = useState(false);
  const searchType = values.itemsView ? 'for items by name.' : 'for records by source.'

  /**
   * A button disable function to prevent the user from spamming requests and causing a crash.
   * @param {object} e the event to pass along.
   */
  function delayUser (e) {
    setDisableButton(true)
    handleItemView(e);
    setTimeout(() => {
      setDisableButton((button) => !button)
    }, 750)
  }

  return (
    <Card className='p-3 my-4'>


      <Form>
        <div className='row d-flex align-items-center justify-content-between'>
          <div className='col-sm-2'>
            <Form.Label> Items View
              <Form.Check
                disabled={disableButton}
                className='my-2'
                type='switch'
                id='itemsView'
                name='itemsView'
                onChange={(e) => delayUser(e)} />
           </Form.Label>
          </div>

          <div className='col-sm-2'>
            <Form.Label>Show Debit or Credits
              <Form.Select className='my-1' name='debitOrCredit' onChange={handleChange}>
                <option  value='null'>Both</option>
                <option  value='true'>Debits</option>
                <option  value='false'>Credits</option>
              </Form.Select>
            </Form.Label>
          </div>

          {values.debitOrCredit !== 'null' && values.itemsView === true ? <CategoryViews handleChange={handleChange} categories={values.debitOrCredit === 'true' ? categoriesOut : categoriesIn} /> : ''}

          <div className='col-sm col-lg-4 d-flex flex-column align-items-start pb-3'>
            <Form.Label htmlFor='search'>Search {searchType}</Form.Label>
            <InputGroup>
                  <Form.Control type='text' name='search' value={search} onChange={e => setSearch(e.target.value)}/>
              <Button variant="outline-secondary" name='search' onClick={() => startSearch(search)}>Search</Button>
            </InputGroup>
          </div>

        </div>
      </Form>

    </Card>
  )
}

/**
 * Creates a dropdown option component for the current category set.
 * @param {array, function} categories a hard coded list of categories, handleChange a function for on change event.
 * @returns a dropdown option component for categories.
 */
function CategoryViews({ categories, handleChange }) {
  const options = categories.map(c => <option key={c.value} value={c.value}>{c.category}</option>)

  return (
    <div className='col-sm-2'>
      <Form.Label>Category Options
        <Form.Select className='m-2' name='category' onChange={handleChange}>
          <option value='null'>Select Category</option>
          {options}
        </Form.Select>
      </Form.Label>
    </div>
  )
}
