// import { useEffect, useState } from 'react';
import './App.css';
import { useMediaQuery } from 'react-responsive';
import Nav from './Components/Nav';
import AppContext from './Components/AppContext';

function App() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 900px)'
  });

  const appState = { isDesktopOrLaptop }

  return (
    <AppContext.Provider value={appState}>
      <div className="App">
        <Nav />
      </div>
    </AppContext.Provider>
  );
}

export default App;
