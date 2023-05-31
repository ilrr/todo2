import { useEffect } from 'react';

import './App.css';
import {
  BrowserRouter as Router, Routes, Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';

import NotFound from './pages/NotFound';
import Tasklist from './pages/Tasklist';
import TopBar from './components/TopBar';
import Logout from './pages/Logout';
import { setToken } from './services/api';
import { loginUser } from './reducers/userReducer';
import ShoppingList from './pages/ShoppingList';
import Error from './pages/Error';
import Toasts from './components/Toasts';
import TasklistList from './pages/TasklistList';

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
          <Route path='/' element={<TasklistList />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>

    </Router>

  );
};

export default App;
