import { useState } from "react"
import Button from "react-bootstrap/Button"
import SignUpModal from "../components/SignUpModal"
import SignInModal from "../components/SignInModal"

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div>
      <h1>HOME PAGE</h1>
      <div className="row">
        <div className="col-6">
          <Button onClick={() => setShowSignIn(true)}>Sign In</Button>
        </div>
        <div className="col-6">
          <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>
        </div>
      </div>
      {showSignIn ? <SignInModal showSignIn={showSignIn} setShowSignIn={setShowSignIn} /> : ''}
      {showSignUp ? <SignUpModal showSignUp={showSignUp} setShowSignUp={setShowSignUp} setShowSignIn={setShowSignIn} /> : ''}
    </div>
  )
}
