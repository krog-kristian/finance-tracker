import './App.css';
import { useMediaQuery } from 'react-responsive';
import Nav from './components/Nav';
import AppContext from './components/AppContext';
import RecordForm from './pages/RecordForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import RecordsView from './pages/RecordsView';
import UserHome from './pages/UserHome';
import Home from './pages/Home';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';



function App() {
  const [user, setUser] = useState()
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 900px)'
  });
  const tokenKey = 'fireUser';

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    const user = token ? jwtDecode(token) : null;
    setUser(user);
    setIsAuthorizing(false);
  }, []);

  if (isAuthorizing) return null;

  function handleSignIn(result) {
    const { user, token } = result;
    localStorage.setItem(tokenKey, token);
    setUser(user);
  }

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
  }

  const appState = { isLargeScreen, user, handleSignIn, handleSignOut, tokenKey }

  return (
    <AppContext.Provider value={appState}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Nav />}>
            <Route index element={!user ? <Home /> : <UserHome />}/>
            <Route path='newrecord' element={<RecordForm />} />
            <Route path='records' element={<RecordsView />} />
          </Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
