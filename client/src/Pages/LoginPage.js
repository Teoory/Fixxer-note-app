import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('https://fixxer-api.vercel.app/login', {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({username, password}),
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('Hatalı kullanıcı adı veya şifre!');
        }
    }

    if(redirect) {
        return <Navigate to="/"/>;
    }

  return (
    <div className='loginArea'>
      <form className="login" onSubmit={login}>
        <h1>Giriş Yap</h1>
        <div className="inputArea">
        <input   type="text"
                placeholder="username" 
                value={username}
                required
                onChange={ev => setUsername(ev.target.value)}/>
        <input  type="password" 
                placeholder="password" 
                value={password}
                required
                onChange={ev => setPassword(ev.target.value)}/>
        </div>
        <button style={{cursor:"pointer",border:"1px solid #000"}}>Giriş</button>
        <div className='newAccount'>Hesabın yokmu? <Link to="/register">Yeni Hesap Oluştur</Link></div>
      </form>
    </div>
  )
}

export default LoginPage