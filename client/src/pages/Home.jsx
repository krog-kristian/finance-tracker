import AppContext from "../components/AppContext"
import { useContext, useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Form from 'react-bootstrap/Form'

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
      {showSignUp ? <SignUpModal showSignUp={showSignUp} setShowSignUp={setShowSignUp} /> : ''}
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

function SignUpModal({ showSignUp, setShowSignUp }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [passwordMatch, setPasswordMatch] = useState()

  function signUp(e) {
    e.preventDefault()
    console.log('password match', passwordMatch)
    if (password !== verifyPassword) return setPasswordMatch(false)
    setPasswordMatch(true)
  }


  return (
    <Modal show={showSignUp} onHide={() => setShowSignUp(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <form onSubmit={e => signUp(e)}>
        <Modal.Body>
          <div className='row g-3'>

            <div className='col'>
              <label className='form-label'>Username
                <input value={username} onChange={e => setUsername(e.target.value)} required className='form-control' type='text' name='username' id='username' placeholder='Username' />
              </label>
              <label className='form-label'>Password
                <Form.Control isValid={passwordMatch} value={password} onChange={e => setPassword(e.target.value)} required className='form-control' type='password' name='password' id='password' placeholder='Password' />
                <Form.Control.Feedback type="valid">
                  Passwords Match.
                </Form.Control.Feedback>
              </label>
              <label className='form-label'>Verify Password
                <Form.Control isInvalid={passwordMatch === false ? true : false} type="password" required value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)} placeholder='Verify Password'/>
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </label>
            </div>

            <div className='col'>
              <label className='form-label'>First Name
                <input value={firstname} onChange={e => setFirstname(e.target.value)} required className='form-control' type='text' name='firstname' id='firstname' placeholder='First Name' />
              </label>
              <label className='form-label'>Last Name
                <input value={lastname} onChange={e => setLastname(e.target.value)} required className='form-control' type='text' name='lastname' id='lastname' placeholder='Last Name' />
              </label>
              <label className='form-label'>Email
                <input  value={email} onChange={e => setEmail(e.target.value)} required className='form-control' type='email' name='email' id='email' placeholder='email@email.com' />
              </label>
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={() => setShowSignUp(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
