import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect, useCallback } from 'react'
import RecordsAccordion from '../components/RecordsAccordion.jsx';
import RecordsOptions from '../components/RecordsOptions.jsx';
import ItemsView from '../components/ItemsView.jsx';
import { sortRecords } from '../lib/dataSorting.js';
import { useUserContext } from "../components/UserContext";
import { deleteRecord } from '../lib/api';

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [endOfRecords, setEndOfRecords] = useState(false);
  const [isError, setIsError] = useState(false);
  const [values, setValues] = useState({
    itemsView: false,
    debitOrCredit: 'null',
    category: 'null',
  });
  const { token } = useUserContext()
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
    setIsLoading(true);
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
      setIsLoading(true);
      setEndOfRecords(false);
  }

  function startSearch() {
    setRecords([]);
    setPage(0);
    setIsLoading(true);
    setEndOfRecords(false);
  }

  /**
   * Callback function to request the current page from the api.
   * In a useCallback to prevent infinite loop when loading.
   * Returns an organized array of record objects after the response is sorted.
   * If their are no more pages sets endOfRecords to true and ends loading.
   */
  const getRecords = useCallback(async () => {
    setIsLoading(true)
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
        setIsLoading(false);
        return
      };
      setPage(myrecords.nextPage);
      const sortedRecords = !values.itemsView ?  sortRecords(myrecords) : myrecords.items;
      setIsLoading(false);
      return sortedRecords;
    } catch (err) {
      console.error(err)
      setIsError(true)
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
    if(isLoading) fetchRecords();
    if (isLoading === undefined) setIsLoading(() => !isLoading)
  }, [getRecords, isLoading])

  function handleLoadMore() {
    setIsLoading(true)
  }

  async function handleDelete(recordId, index) {
    try {
      const deletedrecord = await deleteRecord(recordId, token);
      if (deletedrecord) {
            const deleteRecord = records.toSpliced(index, 1);
            setRecords(deleteRecord);
            return
          }
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading || isLoading === undefined) return <h3 style={{ color: 'white' }}>Loading!</h3>;
  if (isError) <h3 style={{ color: 'white' }}>Something went wrong, please try again.</h3>

  const content = values.itemsView ? <ItemsView allRecords={records} /> : <RecordsAccordion records={records} onDelete={handleDelete} />

  return (
  <>
    <h1>Your Records!</h1>

    <div className='container-xl'>
        <RecordsOptions  values={values} onItemView={handleItemView} onChange={handleChange} onSearch={startSearch} search={search} setSearch={setSearch}/>
        {content}
        <Button className={endOfRecords ? 'm-5 btn-danger' : 'm-5'} disabled={endOfRecords} onClick={handleLoadMore}>
          {endOfRecords ? 'No More Records' : 'Load More!'}
        </Button>
    </div>
  </>
  );
}
