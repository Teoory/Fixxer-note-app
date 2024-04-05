import React, { useContext, useEffect } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home';

import Login from '../Pages/LoginPage';
import Register from '../Pages/RegisterPage';

import NewNote from '../Pages/NewNote';
import NewProduct from '../Pages/NewProduct';
import Products from '../Pages/Products';



const AppRouter = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  
  useEffect(() => {
    fetch('http://localhost:3030/profile', {
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

        {!isUser && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {isWriter && (
          <>
            <Route path="/new" element={<NewNote />} />
            <Route path="/newproduct" element={<NewProduct />} />
          </>
        )}

        <Route path="/products" element={<Products />} />
        
    </Routes>
  )
}

export default AppRouter