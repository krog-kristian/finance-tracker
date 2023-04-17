// import { useEffect, useState } from 'react';
import './App.css';
import { useMediaQuery } from 'react-responsive';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

function Nav() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 900px)'
  });

  return (
  <div className='Nav'>
      <div className='logo-link' style={{ backgroundColor: 'green',
                                          width: 10,
                                          height: 10 }}>
                                          </div>
      {isDesktopOrLaptop ? <NavDesktop /> : <NavMobile />}
  </div>
  );
}

function NavMobile() {
  return (
    <div className='icon-holder'>
      <FontAwesomeIcon icon={faBars} size='2xl' style={{ color: "#511f31", }} />
    </div >
  );
}

function NavDesktop() {
  return (
    <div className='nav-links'>
      <button>Button</button>
    </div >
  );
}

function App() {
  // const [serverData, setServerData] = useState("");

  // useEffect(() => {
  //   async function getServerData() {
  //     const resp = await fetch('/api/hello');
  //     const data = await resp.json();

  //     console.log('Data from server:', data);

  //     setServerData(data.message);
  //   }

  //   getServerData();
  // }, []);

  return (
    <div className="App">
      <Nav />
    </div>
  );
}

export default App;
