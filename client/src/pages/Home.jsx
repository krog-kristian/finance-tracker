import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import SignUpModal from '../components/SignUpModal'
import SignInModal from '../components/SignInModal'
import UserHome from '../components/UserHome'
import { useUserContext } from '../components/UserContext'
import { demoSignIn } from '../lib/api'

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, handleSignIn } = useUserContext()

  if (user) return <UserHome />

  return (
    <>
      <div className='container'>
        <h1>F.I.R.E. Financial</h1>
        <div className='row'>
          <div className='col'>
            <Button className='fs-5' onClick={() => setShowSignIn(true)}>Sign In</Button>
          </div>
          <div className='col'>
            <Button className='fs-5' onClick={() => setShowSignUp(true)}>Sign Up</Button>
          </div>
          <div className='col'>
            <Button variant='warning' className='fs-5' onClick={() => demoSignIn(handleSignIn)}>Enter Demo</Button>
          </div>
        </div>
        <div className='row'>
          <div className='col d-flex justify-content-center my-4'>
            <p className='text-white fs-3 text-start'>
              Welcome to Fire Financial, a site to help you keep track of your money.
              Track both your debits and credits. See your monthly totals and compare them to your budget.
              See where and what you are spending your money on. Click on <button className='text-button' onClick={() => demoSignIn(handleSignIn)}>Enter Demo</button> to try the website without an account; or <button className='text-button' onClick={() => setShowSignUp(true)}>Sign Up</button> to create an account.
            </p>
          </div>
        </div>
      </div>
      {showSignIn ? <SignInModal showSignIn={showSignIn} setShowSignIn={setShowSignIn} /> : ''}
      {showSignUp ? <SignUpModal showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} /> : ''}
    </>
  )
}
