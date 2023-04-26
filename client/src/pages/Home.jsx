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
      {showSignUp ? <SignUpModal showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} /> : ''}
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

function SignUpModal({ showSignUp, setShowSignUp, setShowSignIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [passwordMatch, setPasswordMatch] = useState()
  const [usernameExists, setUsernameExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)

  async function signUp(e) {
    e.preventDefault()
    if (emailExists) setEmailExists(false);
    if (usernameExists) setUsernameExists(false);
    if (password !== verifyPassword) return setPasswordMatch(false)
    setPasswordMatch(true)
    try {
      const newUser = {username, password, firstname, lastname, email}
      const response = await fetch('/api/home/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      if (!response.ok) throw new Error(`Invalid New User.`, { cause: response})
      const confirm = await response.json();
      console.log('new user', confirm)
      setShowSignUp(false);
      setUsernameExists(false);
      setTimeout(() => {
        setShowSignIn(true)
      }, 1000)
    } catch (err) {
      if (err.cause) {
        const serverMessage = await err.cause.json()
          console.log('checking message', serverMessage)
        if (serverMessage?.error?.includes('username')) setUsernameExists(true)
        if (serverMessage?.error?.includes('email')) setEmailExists(true)
      }
      console.error('error signing up', err)
    }
  }

  return (
    <Modal show={showSignUp} onHide={() => setShowSignUp(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
        <button onClick={() => console.log('username exits', usernameExists)}>log</button>
      </Modal.Header>
      <form onSubmit={e => signUp(e)}>
        <Modal.Body>
          <div className='row g-3'>

            <div className='col'>
              <label className='form-label'>Username
                <Form.Control isInvalid={usernameExists} value={username} onChange={e => setUsername(e.target.value)} required className='form-control' type='text' name='username' id='username' placeholder='Username' />
                <Form.Control.Feedback type="invalid">
                  Username already Exists.
                </Form.Control.Feedback>
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
                  Passwords do not match.
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
                <Form.Control isInvalid={emailExists} value={email} onChange={e => setEmail(e.target.value)} required className='form-control' type='text' name='email' id='email' placeholder='email@email.com' />
                <Form.Control.Feedback type="invalid">
                  Email already Exists.
                </Form.Control.Feedback>
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
