import '../App.css';
import { useContext } from 'react';
import AppContext from './AppContext';
import Button from 'react-bootstrap/Button';
import { FaBars } from 'react-icons/fa'

export default function Nav() {
  const { isLargeScreen } = useContext(AppContext)

  return (
    <div className='Nav'>
      <a href="blank" className='.navbar-brand '>My Logo</a>
      {isLargeScreen ? <NavDesktop /> : <NavMobile />}
    </div>
  );
}

function NavMobile() {
  return (
    <div className='icon-holder'>
      {" "}<FaBars size={'2rem'} color={"#511f31"} />{" "}
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
