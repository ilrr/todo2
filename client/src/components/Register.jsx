import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { newToast } from '../reducers/toastReducer';
import userService from '../services/user';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registeredSuccessfylly, setRegisteredSuccessfylly] = useState(false);

  const dispatch = useDispatch();

  const register = event => {
    event.preventDefault();

    userService.register({
      username,
      name,
      password,
    })
      .then(() => {
        setRegisteredSuccessfylly(true);
      })
      .catch(({ error }) => dispatch(newToast({ msg: error })));
  };

  return (
    registeredSuccessfylly
      ? <div>
          Rekisteröityminen onnistui!
          <br />
          <Link to='/login'>Kirjaudu sisään jatkaaksesi!</Link>
        </div>
      : <div>
          <form onSubmit={register}>
          Käyttäjätunnus:
          <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br />
        Nimi:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        /><br/>
        Salasana:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button type="submit">Rekisteröidy</button>
      </form>
      <Link to='/login'>Onko sinulla jo käyttäjätunnus? Kirjaudu tästä!</Link>
    </div>);
};

export default Register;
