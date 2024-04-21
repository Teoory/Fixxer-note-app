import React, { useContext, useEffect } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home';
import Contact from '../Pages/ContactPage';

import Login from '../Pages/LoginPage';
import Register from '../Pages/RegisterPage';
import ProfilPage from '../Pages/ProfilPage';

import NewNote from '../Pages/NewNote';
import NewProduct from '../Pages/NewProduct';
import Products from '../Pages/Products';

import HelpdeskPage from '../Pages/HelpdeskPage';




const AppRouter = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  
  useEffect(() => {
    fetch('https://fixxer-api.vercel.app/profile', {
        credentials: 'include',
    }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        })
  }, []);
  
  const tags = userInfo?.tags;

  const isAdmin = tags?.includes('admin');
  const isEditor = tags?.includes('editor') || isAdmin;
  const isWriter = tags?.includes('writer') || isEditor;
  const isUser = tags?.includes('user') || isWriter;

  return (
    <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/newproduct" element={<NewProduct />} />
        <Route path="/products" element={<Products />} />

        {!isUser && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {isUser && (
          <>
            <Route path="/profile/:username" element={<ProfilPage />} />
          </>
        )}

        {isUser && (
          <>
            <Route path="/new" element={<NewNote />} />
          </>
        )}

        {isAdmin && (
          <>
            <Route path="/helpdesk" element={<HelpdeskPage />} />
          </>
        )}

        
    </Routes>
  )
}

export default AppRouter