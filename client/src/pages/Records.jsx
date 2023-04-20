import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect, useCallback } from 'react'
import AccordionItems from '../components/AccordionItems.jsx';

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState();
  const [endOfRecords, setEndOfRecords] = useState(false);

  const getRecords = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/records/${page}`);
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
    }
  }, [page])

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

  return (
  <>
    <h1>Your Records!</h1>
    <div className='container-xl'>
      <Accordion defaultActiveKey="0" alwaysOpen>
          {records.length > 0 ? <AccordionItems records={records} /> : <p style={{color: 'white', fontSize: '2rem'}}>No Records found.</p>}
      </Accordion>
        <Button className={endOfRecords ? 'm-5 btn-danger' : 'm-5'} disabled={endOfRecords} onClick={handleLoadMore}>
          {endOfRecords ? 'No More Records' : 'Load More!'}
        </Button>
    </div>
  </>
  );
}

function sortRecords(records) {
  const newRecords = records.records
  for (let i = 0; i < newRecords.length; i++) {
    const sortedItems = records.items.filter(item => item.recordId === newRecords[i].recordId)
    newRecords[i].items = sortedItems;
  }
  return newRecords;
}
