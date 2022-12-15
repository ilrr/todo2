import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/user'

const Register = ({ setUserInfo }) => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [registeredSuccessfylly, setRegisteredSuccessfylly] = useState(false)

  const register = (event) => {
    event.preventDefault()

    userService.register({
      username: username,
      name:name,
      password: password
    })
    .then(data => 
      {
        setRegisteredSuccessfylly(true)
      })
      .catch(error=>window.alert(error))
  }

  return (
    registeredSuccessfylly
      ? 
        <div>
          Rekisteröityminen onnistui!
          <br />
          <Link to='/login'>Kirjaudu sisään jatkaaksesi!</Link>
        </div>
      :
        <div>
          <form onSubmit={register}>
          Käyttäjätunnus:
          <input
          type="text"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        /><br />
        Nimi:
        <input
          type="text"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        /><br/>
        Salasana:
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        /><br />
        <button type="submit">Rekisteröidy</button>
      </form>
      <Link to='/login'>Onko sinulla jo käyttäjätunnus? Kirjaudu tästä!</Link>
    </div>)
}

export default Register