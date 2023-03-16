import { useEffect } from 'react';

import './App.css';
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './components/Login';
import Register from './components/Register';
import Tasklists from './components/Tasklists';
import NotFound from './components/NotFound';
import Tasklist from './components/Tasklist';
import TopBar from './components/TopBar';
import Logout from './components/Logout';
import { setToken } from './services/api';
import { loginUser } from './reducers/userReducer';
import ShoppingList from './components/ShoppingList';
import Error from './components/Error';
import Toasts from './components/Toasts';

const App = () => {
  const dispatch = useDispatch(); //

  useEffect(() => {
    const userJSON = window.localStorage.getItem('session');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setToken(user.token);
      dispatch(loginUser(user));
    }
  });

  return (
    <Router>
      <TopBar />
      <Toasts />
        <div className='content'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/lista/:listId' element={<Tasklist />} />
            <Route path='/logout/expired' element={<Logout msg="Istuntosi on vanhentunut. Kirjaudu uudestaan."/>} />
            <Route path='/logout' element={<Logout msg="Hei hei!" />} />
            <Route path='/error' element={<Error />} />
            <Route path='/ostoslista/:listId' element={<ShoppingList />} />
            <Route path='/' element={<Tasklists />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>

    </Router>

  );
};

export default App;
