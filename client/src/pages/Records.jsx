import Accordion from 'react-bootstrap/Accordion';
import { useState, useEffect, useCallback } from 'react'

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [offset, setOffeset] = useState(0);
  const getRecords = useCallback(async () => {
    try {
      const res = await fetch(`/api/records/${offset}`);
      if (!res.ok) throw new Error(`Could not load results ${res.status}`);
      const myrecords = await res.json();
      const sortedRecords = myrecords.records;
      for (let i = 0; i < sortedRecords.length; i++) {
        const sortedItems = myrecords.items.filter(item => item.recordId === sortedRecords[i].recordId)
        sortedRecords[i].items = sortedItems;
      }
      console.log('Records sorted:', sortedRecords);
      return sortedRecords
    } catch (err) {
      console.log('Error fetching:', err);
    }
  }, [offset])

  // useEffect(() => {
  //   const newRecords = getRecords()
  //   console.log('Useeffect records:', newRecords)
  //   setRecords(r => r.concat(newRecords))
  // }, [getRecords])
  useEffect(() => {
    const fetchRecords = async () => {
      const newRecords = await getRecords();
      console.log('Still an object?', newRecords)
      setRecords(r => r.concat(newRecords))
    }
    fetchRecords();
  }, [getRecords])

  return (
  <>
    <h1>Your Records!</h1>
      <div className='container-xl'>
      <Accordion defaultActiveKey="0">
          {records.length > 0 ? <AccordionBits records={records} /> : <p>No Records found</p>}
      </Accordion>
    </div>
  </>
  );
}

function AccordionBits ({ records }) {
console.log('accordion records', records)
return (
  records.map((r, i) => {
    return (
      <Accordion.Item key={i} eventKey={i}>
        <Accordion.Header key={i}>
          Date: {`${r.month}/${r.day}/${r.year}`} Source: {r.source} Total Spent: ${r.totalSpent}
        </Accordion.Header>
        <Accordion.Body key={i}>
          <ul key={i}>
            <AccordionDropdown key={i} items={r.items} />
          </ul>
        </Accordion.Body>
      </Accordion.Item>
    )
  })
)
}

function AccordionDropdown ({ items }) {
  return (
    items.map( (item, index) => <li key={index}>
      {`Item: ${item.itemname} Category: ${item.category} Amount: $${item.amount}`}
    </li>)
  )
}
