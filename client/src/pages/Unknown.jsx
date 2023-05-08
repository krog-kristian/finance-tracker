import { useNavigate } from "react-router-dom"

export default function Unknown() {
  const navigate = useNavigate();

  function redirect() {
    setTimeout(() =>
    navigate('/'), 4000)
  };
  redirect()

  return (
    <h1>Page Not Found.</h1>
  )
}
