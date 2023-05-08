import '../App.css';
import { useContext, useState } from 'react';
import AppContext from './AppContext';
import Button from 'react-bootstrap/Button';
import { FaBars } from 'react-icons/fa'
import { Outlet, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { useMediaQuery } from 'react-responsive';
import Image from 'react-bootstrap/Image'

export default function Nav() {
  const { handleSignOut, user } = useContext(AppContext)
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 900px)'
  });

  return (
    <>
      <div className='spacer'>
        <div className='Nav '>
            <div>
              <Link to='/' className='d-flex text-decoration-none'>
                <Image width="80" fluid roundedCircle src='/Freedom.png' />
                <h2 className='my-auto ms-2 text-white fs-2'>Freedom Financial</h2>
              </Link>
            </div>
          {isLargeScreen ? <NavDesktop handleSignOut={handleSignOut} signedIn={user} /> : <NavMobile handleSignOut={handleSignOut}  signedIn={user}/>}
          </div>
        </div>
      <Outlet />
    </>
  );
}

function NavMobile({ handleSignOut, signedIn }) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false)

  function signOutHamburger() {
    handleSignOut();
    setHamburgerOpen(false);
  }

  const signedInLinks = signedIn ? (
    <>
      <li onClick={() => setHamburgerOpen(false)}>
        <Link to='newrecord'>New Record</Link>
      </li>
      <li onClick={() => setHamburgerOpen(false)}>
        <Link to='records'>Records</Link>
      </li>
      <li onClick={() => setHamburgerOpen(false)}>
        <Link to='budgets'>Budgets</Link>
      </li>
      <li onClick={signOutHamburger}>
        <Link to='/'>Sign Out</Link>
      </li>
    </>
    ) : ''


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
              <Link to='/'>Home</Link>
            </li>
            {signedInLinks}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

function NavDesktop({ handleSignOut, signedIn }) {

  const signedInLinks = signedIn ? (
    <>
      < Link to = 'newrecord' className = "btn btn-primary mx-3" > Add Record</Link>
      <Link to='records' className="btn btn-primary mx-3">Records</Link>
      <Link to='budgets' className="btn btn-primary mx-3">Budgets</Link>
      <Button variant='warning' className='ms-3' onClick={handleSignOut}>Sign Out</Button>{ ' ' }
    </>
   ) : ''

  return (
    <div className='d-flex justify-content-between'>
      <Link to='/' className="btn btn-primary mx-3">Home</Link>
      {signedInLinks}
    </div>
  );
}
