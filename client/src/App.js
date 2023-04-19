import './App.css';
import { useMediaQuery } from 'react-responsive';
import Nav from './components/Nav';
import AppContext from './components/AppContext';
import RecordForm from './components/RecordForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 900px)'
  });

  const appState = { isLargeScreen }

  return (
    <AppContext.Provider value={appState}>
      <div className="App">
        <Nav />
        <div className='spacer' />
        <RecordForm />
      </div>
    </AppContext.Provider>
  );
}

export default App;
