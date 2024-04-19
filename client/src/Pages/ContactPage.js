import React, { useState } from 'react'
import { Navigate } from "react-router-dom";

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            setErrorMessage('Lütfen isim ve e-posta adresi giriniz.');
            return;
        }

        if (message.length < 50) {
            setErrorMessage('Mesaj en az 50 karakter içermelidir.');
            return;
        }
        if (message.length > 600) {
            setErrorMessage('Mesaj en fazla 600 karakter içerebilir.');
            return;
        }
        try {
            const response = await fetch('https://fixxer-api.vercel.app/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });
            const data = await response.json();
            setSuccessMessage('Rapor başarıyla gönderildi.');
            setRedirect(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            setErrorMessage('Rapor gönderilirken bir hata oluştu.');
            console.error('Error sending report:', error);
        }
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="form-container">
            <h2>Raporlama Sayfası</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Adınız:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>E-posta:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Mesajınız:</label>
                    <textarea value={message} maxLength={600} minLength={50} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>
                <button type="submit">Raporu Gönder</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default ContactPage