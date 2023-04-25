import AppContext from "../components/AppContext"
import { useContext, useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div>
      <h1>HOME PAGE</h1>
      <div>
        <Button onClick={() => setShowSignIn(true)}>Sign In</Button>
      </div>
      <div>
        <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
      </div>
      {showSignIn ? <SignInModal showSignIn={showSignIn} setShowSignIn={setShowSignIn} /> : ''}
    </div>
  )
}

function SignInModal({ showSignIn, setShowSignIn }) {
  const { handleSignIn } = useContext(AppContext)

  async function signIn(e) {
    try{
    e.preventDefault()
    const form = new FormData(e.target)
    const response = await fetch('/api/home/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(form.entries()))
    });
    if (!response.ok) throw new Error(`Incorrect Login.`)
    const confirm = await response.json();
    handleSignIn(confirm)
    setShowSignIn(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
      <Modal show={showSignIn} onHide={() => setShowSignIn(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <form onSubmit={e => signIn(e)}>
          <Modal.Body>
          <div className='row g-3'>
            <div className='col'>
              <label className='form-label'>Username
                <input required className='form-control' type='text' name='username' id='username' placeholder='Username' />
              </label>
            </div>
            <div className='col'>
              <label className='form-label'>Password
                <input required className='form-control' type='password' name='passwordVerify' id='passwordVerify' placeholder='Password' />
              </label>
            </div>
          </div>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" type="button" onClick={() => setShowSignIn(false)}>
              Cancel
            </Button>
          <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
  );
}
