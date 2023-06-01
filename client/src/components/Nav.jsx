import '../App.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaBars } from 'react-icons/fa'
import { Outlet, Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import { useMediaQuery } from 'react-responsive';
import Image from 'react-bootstrap/Image'
import { useUserContext } from './UserContext'

// Creates the base of the navbar wrapped in a spacer to push Outlet content down.
export default function Nav() {
  const { handleSignOut, user } = useUserContext()
  const isLargeScreen = useMediaQuery({
    query: '(min-width: 900px)'
  });

  return (
    <>
      <div className='spacer'>
        <div className='Nav '>
            <div>
              <Link to='/' className='d-flex text-decoration-none'>
                <Image width='80' className='logo' fluid roundedCircle src='/freedom.png' />
              <h2 className='my-auto ms-1 fs-2 nav-title'>F.I.R.E. Financial</h2>
              </Link>
            </div>
          {isLargeScreen ? <NavDesktop onSignOut={handleSignOut} user={user} /> : <NavMobile onSignOut={handleSignOut}  user={user}/>}
          </div>
        </div>
      <Outlet />
    </>
  );
}

// Creates the nav content for mobile for signed in and out.
function NavMobile({ onSignOut, user }) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false)

  function signOutHamburger() {
    onSignOut();
    setHamburgerOpen(false);
  }

  const signedInLinks = user ? (
    <>
      <li className='list-group-item bg-secondary fs-5' onClick={() => setHamburgerOpen(false)}>
        <Link className='text-decoration-none text-white' to='newrecord'>New Record</Link>
      </li>
      <li className='list-group-item bg-secondary' onClick={() => setHamburgerOpen(false)}>
        <Link className='text-decoration-none text-white fs-5' to='records'>Records</Link>
      </li>
      <li className='list-group-item bg-secondary' onClick={() => setHamburgerOpen(false)}>
        <Link className='text-decoration-none text-white fs-5' to='budgets'>Budgets</Link>
      </li>
      <li className='list-group-item bg-warning' onClick={signOutHamburger}>
        <Link className='text-decoration-none text-reset fs-5' to='/'>{user.userId === 1 ? 'Exit Demo' : 'Sign Out'}</Link>
      </li>
    </>
    ) : ''


  return (
    <>
      <div className='icon-holder'>
        <button className='invisible' onClick={() => setHamburgerOpen(true)}>
          {' '}<FaBars className='visible' size={'2rem'} color={'#511f31'} />{' '}
        </button>
      </div >
      <Modal show={hamburgerOpen} className='' fullscreen={true} onHide={() => setHamburgerOpen(false)}>
        <Modal.Header closeButton closeVariant='white' style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#414535'
        }}>
          <Modal.Title>
            <Link to='/' className='d-flex text-decoration-none'>
              <Image width='80' fluid roundedCircle src='/Freedom.png' />
              <h2 className='my-auto ms-2 text-white fs-2'>Freedom Financial</h2>
            </Link>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#414535' }}>
          <ul className='list-group'>
            <li className='list-group-item bg-secondary' onClick={() => setHamburgerOpen(false)}>
              <Link className='text-decoration-none text-white fs-5' to='/'>Home</Link>
            </li>
            {signedInLinks}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}

//Creates the navbar content on desktop when signed in or out.
function NavDesktop({ onSignOut, user }) {

  const signedInLinks = user ? (
    <>
      <Link to = 'newrecord' className = 'btn btn-primary mx-3' > Add Record</Link>
      <Link to='records' className='btn btn-primary mx-3'>Records</Link>
      <Link to='budgets' className='btn btn-primary mx-3'>Budgets</Link>
      <Button variant='warning' className='ms-3' onClick={onSignOut}>{user.userId === 1 ? 'Exit Demo' : 'Sign Out'}</Button>
    </>
   ) : ''

  return (
    <div className='d-flex justify-content-between'>
      <Link to='/' className='btn btn-primary mx-3'>Home</Link>
      {signedInLinks}
    </div>
  );
}
