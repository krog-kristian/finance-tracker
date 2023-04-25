import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import { categoriesOut, categoriesIn } from '../lib/catergory-data';


export default function RecordsOptions({values, setValues, handleChange }) {


  return (
    <Card className='p-3 my-4'>
      <Form>
        <div className='row'>

          <div className='col-sm-2'>
            <Form.Label> Items View
              <Form.Check
                className='my-2'
                type='switch'
                id='itemsView'
                name='itemsView'
                onChange={(e) => setValues({ ...values, [e.target.name]: !values.itemsView })} />
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
        </div>
      </Form>
    </Card>
  )
}

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
