import { useContext, useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import Alert from 'react-bootstrap/Alert'
import UserContext from './UserContext';

/**
 * Created the modal component and controls the request to sign a user in.
 * @param {boolean, function} showSignIn, whether to be open or not, setShowSignIn to close the modal.
 * @returns the modal component for signing in.
 */
export default function SignInModal({ showSignIn, setShowSignIn }) {
  const { handleSignIn } = useContext(UserContext)
  const [errorMessageShowing, setErrorMessageShowing] = useState(false)

  async function signIn(e) {
    try {
      e.preventDefault()
      const form = new FormData(e.target)
      const response = await fetch('/api/home/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(form.entries()))
      })
      if (!response.ok) throw new Error(`Incorrect Login.`)
      const confirm = await response.json();
      handleSignIn(confirm)
      setShowSignIn(false)
    } catch (err) {
      setErrorMessageShowing(true)
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
          <Alert show={errorMessageShowing} variant="danger">
            <Alert.Heading>Incorrect Login.</Alert.Heading>
            <p>
              Unable to log in try again.
            </p>
            <hr />
          </Alert>
          <div className='row g-3'>
            <div className='col'>
              <label className='form-label'>Username
                <input required className='form-control' type='text' name='userName' autoComplete='username' placeholder='Username' />
              </label>
            </div>
            <div className='col'>
              <label className='form-label'>Password
                <input required className='form-control' autoComplete="current-password" type='password' name='passwordVerify' placeholder='Password' />
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
