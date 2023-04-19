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
      console.log('The records:', myrecords)
      return myrecords
    } catch (err) {
      console.log('Error fetching:', err);
    }
  }, [offset])

  useEffect(() => {
    const newRecords = getRecords()
    setRecords(r => r.concat(newRecords))
  }, [getRecords])


  return (
  <>
    <h1>Your Records!</h1>
      <div className='container-xl'>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Accordion Item #1</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  </>
  );
}
