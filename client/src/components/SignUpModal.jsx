import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { sendSignUp } from '../lib/api'

/**
 * Function to create the signup modal and handle a user signing up.
*/
export default function SignUpModal({ showSignUp, setShowSignUp, setShowSignIn }) {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [passwordMatch, setPasswordMatch] = useState()
  const [userNameExists, setUserNameExists] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [showingAlert, setShowingAlert] = useState(false)

  /**
   * Uses a controlled form variables to verify password matching and send a new user request to the server.
   * If the server says the username or email is already taken notifies the user.
   * Shows a confirmation and opens the sign in modal.
   * @param {object} e the form submit event.
   */
  async function signUp(e) {
    e.preventDefault()
    if (emailExists) setEmailExists(false)
    if (userNameExists) setUserNameExists(false)
    if (password !== verifyPassword) return setPasswordMatch(false)
    setPasswordMatch(true)
    try {
      const newUser = { userName, password, firstName, lastName, email }
      await sendSignUp(newUser)
      setShowingAlert(true)
      setTimeout(() => {
        setShowSignUp(false)
        setShowSignIn(true)
        setShowingAlert(false)
      }, 1500)
    } catch (err) {
      if (err.cause) {
        const serverMessage = await err.cause.json()
        if (serverMessage?.error?.includes('userName')) setUserNameExists(true)
        if (serverMessage?.error?.includes('email')) setEmailExists(true)
      }
      console.error('Error signing up', err)
    }
}

return (
  <>
    <Modal show={showSignUp} onHide={() => setShowSignUp(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <form onSubmit={e => signUp(e)}>
        <Modal.Body>
          <Alert show={showingAlert} variant='success'>
            <Alert.Heading>Success!</Alert.Heading>
            <p>
              New User Created, please log in.
            </p>
            <hr />
          </Alert>
          <div className='row g-3'>

            <div className='col'>
              <label className='form-label'>Username
                <Form.Control isInvalid={userNameExists} autoComplete='username' value={userName} onChange={e => setUserName(e.target.value)} required className='form-control' type='text' name='userName' placeholder='Username' />
                <Form.Control.Feedback type='invalid'>
                  Username already Exists.
                </Form.Control.Feedback>
              </label>
              <label className='form-label'>Password
                <Form.Control isValid={passwordMatch} value={password} onChange={e => setPassword(e.target.value)} required className='form-control' type='password' name='password' autoComplete='new-password' placeholder='Password' />
                <Form.Control.Feedback type='valid'>
                  Passwords Match.
                </Form.Control.Feedback>
              </label>
              <label className='form-label'>Verify Password
                <Form.Control isInvalid={passwordMatch === false ? true : false} type='password' required value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)} autoComplete='new-password' placeholder='Verify Password' />
                <Form.Control.Feedback type='invalid'>
                  Passwords do not match.
                </Form.Control.Feedback>
              </label>
            </div>

            <div className='col'>
              <label className='form-label'>First Name
                <input value={firstName} onChange={e => setFirstName(e.target.value)} required className='form-control' type='text' name='firstname' placeholder='First Name' />
              </label>
              <label className='form-label'>Last Name
                <input value={lastName} onChange={e => setLastName(e.target.value)} required className='form-control' type='text' name='lastname' placeholder='Last Name' />
              </label>
              <label className='form-label'>Email
                <Form.Control isInvalid={emailExists} value={email} onChange={e => setEmail(e.target.value)} required className='form-control' type='text' name='email' placeholder='email@email.com' />
                <Form.Control.Feedback type='invalid'>
                  Email already Exists.
                </Form.Control.Feedback>
              </label>
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' type='button' onClick={() => setShowSignUp(false)}>
            Cancel
          </Button>
          <Button variant='primary' type='submit'>
            Sign Up
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  </>
)
}
