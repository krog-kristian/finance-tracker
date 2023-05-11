import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useUsers() {
  const tokenKey = 'fireUser';
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
  if (localStorage.getItem(tokenKey)) {
    const userData = localStorage.getItem(tokenKey)
    const {user, token} = JSON.parse(userData);
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

  return {user, token, handleSignIn, handleSignOut}

}
