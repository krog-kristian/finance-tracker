// import { useEffect, useState } from 'react';
import './App.css';
import { useMediaQuery } from 'react-responsive';
import Nav from './Components/Nav';
import AppContext from './Components/AppContext';
import RecordForm from './Components/RecordForm';

function App() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 900px)'
  });

  const appState = { isDesktopOrLaptop }

  return (
    <AppContext.Provider value={appState}>
      <div className="App">
        <Nav />
        <RecordForm />
      </div>
    </AppContext.Provider>
  );
}

export default App;
