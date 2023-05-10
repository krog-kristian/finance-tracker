import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect, useCallback, useContext } from 'react'
import AccordionItems from '../components/AccordionItems.jsx';
import RecordsOptions from '../components/RecordsOptions.jsx';
import ItemsView from '../components/ItemsView.jsx';
import { sortRecords } from '../lib/dataSorting.js';
import UserContext from '../components/UserContext';

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
  const { token } = useContext(UserContext)
  const [search, setSearch] = useState('');

  /**
   * Updates the values object when inputs are changed and sets up a new request.
   * @param {obect} e, the event of targeted input.
   */
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setSearch('');
    setRecords([]);
    setPage(0);
    setLoading(true);
    setEndOfRecords(false);
  };

  /**
   * Updates the itemView value and sets up a new request.
   * @param {object} e, the event of the item view switch.
   */
  const handleItemView = (e) => {
      setValues({ ...values, [e.target.name]: !values.itemsView });
      setSearch('');
      setRecords([]);
      setPage(0);
      setLoading(true);
      setEndOfRecords(false);
  }

  function startSearch() {
    setRecords([]);
    setPage(0);
    setLoading(true);
    setEndOfRecords(false);
  }

  /**
   * Callback function to request the current page from the api.
   * In a useCallback to prevent infinite loop when loading.
   * Returns an organized array of record objects after the response is sorted.
   * If their are no more pages sets endOfRecords to true and ends loading.
   */
  const getRecords = useCallback(async () => {
    setLoading(true)
    try {
      const itemsEndpoint = `/api/records/items/${page}/${values.debitOrCredit}/${values.category}/${search}`;
      const recordsEndpoint = `/api/records/${page}/${values.debitOrCredit}/${search}`;
      const requestEndpoint = values.itemsView ? itemsEndpoint : recordsEndpoint;
      const res = await fetch(requestEndpoint, {
        headers: { 'Authorization': `Bearer ${token}`}
      });
      if (!res.ok) throw new Error(`Could not load results ${res.status}`);
      const myrecords = await res.json();
      if (!myrecords.nextPage) {
        setEndOfRecords(true);
        setLoading(false);
        return
      };
      setPage(myrecords.nextPage);
      const sortedRecords = !values.itemsView ?  sortRecords(myrecords) : myrecords.items;
      setLoading(false);
      return sortedRecords;
    } catch (err) {
      console.error(err)
      setIsErrors(true)
    }
  }, [page, token, values, search]);

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

  const loadingMessage = endOfRecords || <h3 style={{ color: 'white' }}>Loading!</h3>;
  const errorMessage = <h3 style={{ color: 'white' }}>Something went wrong, please try again.</h3>

  const accordionReady = records.length > 0 ? <AccordionItems records={records} /> : (isErrors ? errorMessage : loadingMessage)
  const content = values.itemsView ? <ItemsView allRecords={records} /> : accordionReady
  return (
  <>
    <h1>Your Records!</h1>

    <div className='container-xl'>
        <RecordsOptions  values={values} handleItemView={handleItemView} handleChange={handleChange} startSearch={startSearch} search={search} setSearch={setSearch}/>
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
