import '../App.css';
import { useContext, useState } from 'react';
import AppContext from './AppContext';
import Button from 'react-bootstrap/Button';
import { FaBars } from 'react-icons/fa'
import { Outlet, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'

export default function Nav() {
  const { isLargeScreen } = useContext(AppContext)

  return (
    <>
      <div className='spacer'>
        <div className='Nav '>
            <div className=''>
            <Link to='/' className='.navbar-brand '>My Logo</Link>
            </div>
            {isLargeScreen ? <NavDesktop /> : <NavMobile />}
          </div>
        </div>
      <Outlet />
    </>
  );
}

function NavMobile() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  return (
    <>
      <div className='icon-holder'>
        <button className='invisible' onClick={() => setHamburgerOpen(true)}>
          {" "}<FaBars className='visible' size={'2rem'} color={"#511f31"} />{" "}
        </button>
      </div >
      <Modal show={hamburgerOpen} fullscreen={true} onHide={() => setHamburgerOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li onClick={() => setHamburgerOpen(false)}>
              <Link to='/'>New Record</Link>
            </li>
            <li onClick={() => setHamburgerOpen(false)}>
              <Link to='records'>Records</Link>
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

function NavDesktop() {
  return (
      <div className='d-flex justify-content-between'>
        <Link to='/' class="btn btn-primary mx-3">Add Record</Link>
        <Link to='records' class="btn btn-primary mx-3">Records</Link>
        <Button variant='warning' className='ms-3'>Sign Out</Button>{' '}
      </div>
  );
}
