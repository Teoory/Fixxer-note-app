import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import NewNote from '../Pages/NewNote';

import Login from '../Pages/LoginPage';
import Register from '../Pages/RegisterPage';

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/new" element={<NewNote />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default AppRouter