import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect, useCallback } from 'react'

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState();
  const [allRecords, setAllRecords] = useState(false);

  const getRecords = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/records/${offset}`);
      if (!res.ok) throw new Error(`Could not load results ${res.status}`);
      const myrecords = await res.json();
      if (myrecords.error === 'no more records') {
        setAllRecords(true);
        setLoading(false);
        return
      };
      const sortedRecords = myrecords.records;
      for (let i = 0; i < sortedRecords.length; i++) {
        const sortedItems = myrecords.items.filter(item => item.recordId === sortedRecords[i].recordId)
        sortedRecords[i].items = sortedItems;
      }
      setLoading(false)
      return sortedRecords
    } catch (err) {
      console.error('Error fetching:', err);
    }
  }, [offset])

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
    setOffset(o => o + 5)
    setLoading(true)
  }

  return (
  <>
    <h1>Your Records!</h1>
    <div className='container-xl'>
      <Accordion defaultActiveKey="0">
          {records.length > 0 ? <AccordionBits records={records} /> : <p>No Records found</p>}
      </Accordion>
      <Button disabled={allRecords} onClick={handleLoadMore}>Load More!</Button>
    </div>
  </>
  );
}

function AccordionBits ({ records }) {
return (
  records.map((r, i) => {
    return (
      <Accordion.Item key={`${i}AI`} eventKey={i}>
        <Accordion.Header key={`${i}AH`}>
          Date: {`${r.month}/${r.day}/${r.year}`} Source: {r.source} Total Spent: ${r.totalSpent}
        </Accordion.Header>
        <Accordion.Body key={`${i}AB`}>
          <ul key={`${i}UL`}>
            <AccordionDropdown items={r.items} />
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    )
  })
)
}

function AccordionDropdown ({ items }) {
  return (
    items.map((item, index) => <li key={`${item.itemId}`}>
      {`Item: ${item.itemname} Category: ${item.category} Amount: $${item.amount}`}
    </li>)
  )
}
