import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../reducers/userReducer"

const Logout = () => {

  const dispatch = useDispatch()
  dispatch(logout())
  window.localStorage.clear()

  return (
    <div>
      Hei hei!
    </div>
  )
}

export default Logout