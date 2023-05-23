import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

//Context provider to maintain the token and user states.
const UserContextProvider = ({ children }) => {
  const tokenKey = 'fireUser';
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(tokenKey)) {
      const userData = localStorage.getItem(tokenKey)
      const { user, token } = JSON.parse(userData);
      setUser(user);
      setToken(token);
    }

  }, [])

  function handleSignIn(result) {
    const { user, token } = result;
    localStorage.setItem(tokenKey, JSON.stringify({ token, user }));
    setUser(user);
    setToken(token)
  }

  function handleSignOut() {
    localStorage.removeItem(tokenKey);
    setUser(undefined);
    navigate('/')
  }

  const userData = { user, token, handleSignIn, handleSignOut }

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  )
}

//Custom hook for easy access to UserContext.
const useUserContext = () => {

  const userContext = useContext(UserContext)

  return userContext;
}

export { UserContext, UserContextProvider, useUserContext };
