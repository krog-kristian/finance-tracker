import './App.css';
import Nav from './components/Nav';
import UserContext from './components/UserContext';
import RecordForm from './pages/RecordForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route} from 'react-router-dom';
import RecordsView from './pages/RecordsView';
import UserHome from './pages/UserHome';
import Home from './pages/Home';
import Budgets from './pages/Budgets';
import Unknown from './pages/Unknown';
import { useUsers } from './lib/useUsers';



function App() {

  const { user, handleSignIn, handleSignOut, token } = useUsers()
  const appState = { user, handleSignIn, handleSignOut, token }

  return (
    <UserContext.Provider value={appState}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Nav />}>
            <Route index element={!user ? <Home /> : <UserHome />}/>
            <Route path='newrecord' element={<RecordForm />} />
            <Route path='records' element={<RecordsView />} />
            <Route path='budgets' element={<Budgets />} />
            <Route path='*' element={<Unknown />} />
          </Route>
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
