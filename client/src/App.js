import { useEffect, useState } from 'react'

import './App.css';
//import LoginOrRegister from './components/LoginOrRegister';
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tasklists from './components/Tasklists';
import { useDispatch } from 'react-redux';
import NotFound from './components/NotFound';
import Tasklist from './components/Tasklist';
import TopBar from './components/TopBar';
import Logout from './components/Logout';
import { setToken } from './services/api';
import { loginUser } from './reducers/userReducer'
import React from 'react';
import UploadImage from './components/UploadImage';

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const userJSON = window.localStorage.getItem('session');
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setToken(user.token)
      dispatch(loginUser(user));
    }
  })

  return (
    <Router>
      <TopBar />
      <div className='content'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/lista/:listId' element={<Tasklist />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/img' element={<UploadImage />} />
          <Route path='/' element={<Tasklists />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Router>


  )
}

export default App;
