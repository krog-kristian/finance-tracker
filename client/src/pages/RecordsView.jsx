import Button from 'react-bootstrap/esm/Button';
import { useState, useEffect, useCallback } from 'react'
import RecordsAccordion from '../components/RecordsAccordion.jsx';
import RecordsOptions from '../components/RecordsOptions.jsx';
import ItemsView from '../components/ItemsView.jsx';
import { sortRecords } from '../lib/dataSorting.js';
import { useUserContext } from '../components/UserContext';
import { deleteRecord } from '../lib/api';
import ConfirmationModal from '../components/ConfirmationModal.jsx';

export default function RecordsView() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [endOfRecords, setEndOfRecords] = useState(false);
  const [isError, setIsError] = useState(false);
  const [values, setValues] = useState({
    itemsView: false,
    isDebit: 'null',
    category: 'null',
  });
  const { token } = useUserContext()
  const [search, setSearch] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState();
  const [scroll, setScroll] = useState(0)

  /**
   * Callback function to request the current page from the api.
   * In a useCallback to prevent infinite loop when loading.
   * Returns an organized array of record objects after the response is sorted.
   * If their are no more pages sets endOfRecords to true and ends loading.
   */
  const getRecords = useCallback(async () => {
    setIsLoading(true)
    try {
      const itemsEndpoint = `/api/records/items/${page}/${values.isDebit}/${values.category}/${search}`;
      const recordsEndpoint = `/api/records/${page}/${values.isDebit}/${search}`;
      const requestEndpoint = values.itemsView ? itemsEndpoint : recordsEndpoint;
      const res = await fetch(requestEndpoint, {
        headers: { 'Authorization': `Bearer ${token}`}
      });
      if (!res.ok) throw new Error(`Could not load results ${res.status}`);
      const myrecords = await res.json();
      if (!myrecords.nextPage) {
        setEndOfRecords(true);
        return
      };
      setPage(myrecords.nextPage);
      const sortedRecords = !values.itemsView ?  sortRecords(myrecords) : myrecords.items;
      return sortedRecords;
    } catch (err) {
      setIsError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
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
    window.scroll(0, scroll)
  }, [getRecords, isLoading, scroll])

  function handleLoadMore() {
    setScroll(scroll + 800);
    setIsLoading(true);
  }

  async function handleDelete(recordId, index) {
    try {
      const deletedrecord = await deleteRecord(recordId, token);
      if (deletedrecord) {
            setRecords(r => r.toSpliced(index,1));
            setScroll(0);
            return
          }
    } catch (err) {
      setIsError(true)
      console.error(err);
    }
  }

  /**
 * Updates the values object when inputs are changed and sets up a new request.
 * @param {obect} e, the event of targeted input.
 */
  const handleChange = (e) => {
    if (e.target.name === 'isDebit') {
      setValues({...values, isDebit: e.target.value, category: 'null'})
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
    setSearch('');
    setRecords([]);
    setPage(0);
    setIsLoading(true);
    setEndOfRecords(false);
    setScroll(0);
  };

  /**
   * Updates the itemView value and sets up a new request.
   * @param {object} e, the event of the item view switch.
   */
  const handleItemView = (e) => {
    setValues({ ...values, [e.target.name]: !values.itemsView, category: 'null' });
    setSearch('');
    setRecords([]);
    setPage(0);
    setIsLoading(true);
    setEndOfRecords(false);
    setScroll(0);
  }

  function startSearch(e) {
    setRecords([]);
    setPage(0);
    setIsLoading(true);
    setEndOfRecords(false);
    setScroll(0);
  }

  const handleClose = () => setConfirmVisible(false);

  const handleShow = (recordId, index) => {
    setConfirmVisible(true)
    setRecordToDelete([recordId, index])
  }

  const handleConfirm = () => {
    handleClose();
    handleDelete(...recordToDelete, token)
  }

  if (isLoading || isLoading === undefined) return <h3 style={{ color: 'white' }}>Loading!</h3>;
  if (isError) return <h3 style={{ color: 'white' }}>Something went wrong, please try again.</h3>

  const content = values.itemsView ? <ItemsView allRecords={records} /> : <RecordsAccordion records={records} onDelete={handleShow} />

  return (
  <>
    <h1>Your Records!</h1>
    <ConfirmationModal onConfirm={handleConfirm} confirmVisible={confirmVisible} onHide={handleClose}>
      Are you sure you wish to delete this record along with all items?
    </ConfirmationModal>

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
