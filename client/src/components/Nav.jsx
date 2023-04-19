import '../App.css';
import { useContext } from 'react';
import AppContext from './AppContext';
import Button from 'react-bootstrap/Button';
import { FaBars } from 'react-icons/fa'
import { Outlet, Link } from 'react-router-dom'

export default function Nav() {
  const { isLargeScreen } = useContext(AppContext)

  return (
    <>
      <div className='spacer'>
        <div className='Nav'>
          <Link to='/' className='.navbar-brand '>My Logo</Link>
          {isLargeScreen ? <NavDesktop /> : <NavMobile />}
        </div>
      </div>
      <Outlet />
    </>
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
      <Link to='/' class="btn btn-primary">Add Record</Link>
      <Link to='records' class="btn btn-primary">Records</Link>
      <Button variant='warning'>Sign Out</Button>{' '}
    </div >
  );
}
