import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import { useContext } from 'react';
import AppContext from './AppContext';

export default function Nav() {
const { isDesktopOrLaptop } = useContext(AppContext)

  return (
    <div className='Nav'>
      <div className='logo-link' style={{
        backgroundColor: 'green',
        width: 10,
        height: 10
      }}>
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
