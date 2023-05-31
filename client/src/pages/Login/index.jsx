import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { newToast } from '../../reducers/toastReducer';
import { loginUser } from '../../reducers/userReducer';
import { setToken } from '../../services/api';
import userService from '../../services/user';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  // const [error, setError] = useState('');

  const dispatch = useDispatch();

  const logIn = event => {
    event.preventDefault();

    userService.login({ username, password })
      .then(data => {
        dispatch(loginUser(data));
        const user = data;
        setToken(user.token);
        window.localStorage.setItem('session', JSON.stringify(user));
        setLoggedIn(true);
      })
      .catch(error => {
        if (error.error)
          dispatch(newToast({ msg: error.error }));
        else
          console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={logIn}>
        Käyttäjätunnus:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br />
        Salasana:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button type="submit">Kirjaudu</button>
      </form>
      <Link to='/register'>Eikö sinulla ole vielä käyttäjätunnusta? Rekisteröidy tästä!</Link>
      {loggedIn ? <Navigate to='/' /> : ''}
    </div>
  );
};

export default Login;
