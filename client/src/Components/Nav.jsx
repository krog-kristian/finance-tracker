import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import '../App.css';
import { useContext } from 'react';
import AppContext from './AppContext';
import Button from 'react-bootstrap/Button';

export default function Nav() {
const { isDesktopOrLaptop } = useContext(AppContext)

  return (
    <div className='Nav'>
      <a href="blank" className='.navbar-brand '>My Logo</a>
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
      <Button variant='warning'>Sign Out</Button>{' '}
    </div >
  );
}
