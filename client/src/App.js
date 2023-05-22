import './App.css';
import Nav from './components/Nav';
import { UserContextProvider } from './components/UserContext';
import RecordForm from './pages/RecordForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route} from 'react-router-dom';
import RecordsView from './pages/RecordsView';
import Home from './pages/Home';
import Budgets from './pages/Budgets';
import Unknown from './pages/Unknown';
import Footer from './components/Footer';

function App() {

  return (
    <UserContextProvider>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Nav />}>
            <Route index element={ <Home />}/>
            <Route path='newrecord' element={<RecordForm />} />
            <Route path='records' element={<RecordsView />} />
            <Route path='budgets' element={<Budgets />} />
            <Route path='*' element={<Unknown />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </UserContextProvider>
  );
}

export default App;
