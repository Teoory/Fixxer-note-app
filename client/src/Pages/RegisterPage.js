import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email,setEmail] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
    });

    async function register(ev) {
        ev.preventDefault();
        if (password !== confirmPassword) {
            alert('Şifreler birbiriyle eşleşmiyor!');
            return;
        }
        if (!passwordValidations.minLength || !passwordValidations.hasUppercase || !passwordValidations.hasLowercase || !passwordValidations.hasNumber)
        {
            alert('Lütfen şifrenizi kontrol edin!');
            return;
        }
        const response = await fetch('http://localhost:3030/register', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({username, password, email}),
            headers: {'Content-Type': 'application/json'},
        });
        if (response.ok) {
            alert('Kayıt Başarılı!');
            setRedirect(true);
        } else {
            alert('Kayıt olurken hata oluştu! Lütfen tekrar deneyin.');
        }
    }

    const validatePassword = (value) => {
        const validations = {
            minLength: value.length >= 8,
            hasUppercase: /[A-Z]/.test(value),
            hasLowercase: /[a-z]/.test(value),
            hasNumber: /\d/.test(value),
        };
        setPasswordValidations(validations);
    };

    const handleChangePassword = (ev) => {
        const value = ev.target.value;
        setPassword(value);
        validatePassword(value);
    };

    if(redirect) {
      return <Navigate to="/login"/>;
    }

    return (
        <div className='loginArea'>
          <form className="login" onSubmit={register}>
            <h1>Kayıt Ol</h1>
            <div className="inputArea">
            <input type="email"
                    placeholder="email"
                    value={email}
                    required
                    onChange={ev => setEmail(ev.target.value)} />
            <input type="text"
                    placeholder="username"
                    value={username}
                    minLength={5}
                    maxLength={16}
                    required
                    onChange={ev => setUsername(ev.target.value)} />
            <input type="password"
                    placeholder="password"
                    value={password}
                    minLength={8}
                    required
                    autoComplete="off"
                    onChange={handleChangePassword} />
                    <div style={{marginBottom:'10px'}}>
                      {!passwordValidations.minLength && <li style={{color: passwordValidations.minLength ? 'green' : 'red'}}>En az 8 karakter</li>}
                      {!passwordValidations.hasUppercase && <li style={{color: passwordValidations.hasUppercase ? 'green' : 'red'}}>Büyük harf</li>}
                      {!passwordValidations.hasLowercase && <li style={{color: passwordValidations.hasLowercase ? 'green' : 'red'}}>Küçük harf</li>}
                      {!passwordValidations.hasNumber && <li style={{color: passwordValidations.hasNumber ? 'green' : 'red'}}>Rakam</li>}
                    </div>
            <input type="password"
                    placeholder="confirm password"
                    value={confirmPassword}
                    required
                    onChange={ev => setConfirmPassword(ev.target.value)} />
                    {confirmPassword !== '' && password !== confirmPassword && <div className="password-validations">Şifreler eşleşmiyor!</div>}
            </div>
            <button style={{cursor:"pointer",border:"1px solid #000"}}>Kayıt Ol</button>
            <div className='newAccount'>Zaten bir hesabın var mı? <Link to="/login">Giriş Yap</Link></div>
          </form>
        </div>
    )
}

export default RegisterPage