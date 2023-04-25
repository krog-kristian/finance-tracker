import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect, useCallback } from 'react'
import AccordionItems from '../components/AccordionItems.jsx';
import RecordsOptions from '../components/RecordsOptions';

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState();
  const [endOfRecords, setEndOfRecords] = useState(false);
  const [isErrors, setIsErrors] = useState(false);
  const [values, setValues] = useState({
    itemsView: false,
    debitOrCredit: 'null',
    category: 'null',
  });

  /**
   * Updates the values object when inputs are changed.
   * @param {obect} e, the event of targeted input.
   */
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
    setRecords([]);
    setPage(0)
    setLoading(true);
    setEndOfRecords(false)
  };

  /**
   * Callback function to request the current page from the api.
   * In a useCallback to prevent infinite loop when loading.
   * Returns an organized array of record objects after the response is sorted.
   * If their are no more pages sets endOfRecords to true and ends loading.
   */
  const getRecords = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/records/${page}/${values.debitOrCredit}/${values.category}`);
      if (!res.ok) throw new Error(`Could not load results ${res.status}`);
      const myrecords = await res.json();
      if (!myrecords.nextPage) {
        setEndOfRecords(true);
        setLoading(false);
        return
      };
      setPage(myrecords.nextPage);
      const sortedRecords = sortRecords(myrecords);
      setLoading(false);
      return sortedRecords;
    } catch (err) {
      console.error(err)
      setIsErrors(true)
    }
  }, [page, values.debitOrCredit, values.category]);

  /**
   * Calls the getRecords function once first render and whenver loading is true.
   * Takes the newRecords received and updates the records array.
   */
  useEffect(() => {
    const fetchRecords = async () => {
      const newRecords = await getRecords();
      if (!newRecords) return
      setRecords(r => r.concat(newRecords))
    }
    if(loading) fetchRecords();
    if (loading === undefined) setLoading(() => !loading)
  }, [getRecords, loading])

  function handleLoadMore() {
    setLoading(true)
  }

  const loadingMessage = <h3 style={{ color: 'white' }}>Loading!</h3>;
  const errorMessage = <h3 style={{ color: 'white' }}>Something went wrong, please try again.</h3>

  const accordionReady = records.length > 0 ? <AccordionItems records={records} /> : (isErrors ? errorMessage : loadingMessage)
  const content = values.itemsView ? <ItemsView allRecords={records} /> : accordionReady
  return (
  <>
    <h1>Your Records!</h1>

    <div className='container-xl'>
        <RecordsOptions  values={values} setValues={setValues} handleChange={handleChange}/>
      <Accordion defaultActiveKey="0" alwaysOpen>
        {content}
      </Accordion>
        <Button className={endOfRecords ? 'm-5 btn-danger' : 'm-5'} disabled={endOfRecords} onClick={handleLoadMore}>
          {endOfRecords ? 'No More Records' : 'Load More!'}
        </Button>
    </div>
  </>
  );
}

/**
 * Turns an object containing an array of record object and an array of item objects,
 * and adds matching items as a propety of the corresponding object.
 * @param {object} records is the object returned from the database.
 * @returns an array of record objects.
 */
function sortRecords(records) {
  const newRecords = records.records
  for (let i = 0; i < newRecords.length; i++) {
    const sortedItems = records.items.filter(item => item.recordId === newRecords[i].recordId)
    newRecords[i].items = sortedItems;
  }
  return newRecords;
}

function ItemsView({ allRecords }) {
  console.log('sorting', allRecords)
  const listItems = allRecords.map(r => r.items.map( i => <li className='list-group-item' key={i.itemId}>{`Date: ${r.month + 1}/${r.day + 1}/${r.year} Item:${i.itemname} Amount: ${i.amount} From: ${r.source}`}</li>)).flat();
  console.log('the list items', listItems)
  return (
    <ul className='list-group'>
      {listItems}
    </ul>
  )
}
