import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { Navigate } from "react-router-dom";

const NewProduct = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [inputs, setInputs] = useState([{ id: 0, value: '' }]);
    const [karOran, setKarOran] = useState(25);
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [redirect, setRedirect] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        fetch('https://fixxer-api.vercel.app/profile', {
            credentials: 'include',
        }).then(response => {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                });
            })
    }, []);


    const addInput = () => {
        setInputs([...inputs, { id: inputs.length, value: '' }]);
        const newInput = document.querySelector('.amount:last-child');
        if (newInput) {
            newInput.focus();
        }
    };

    const handleKeyPress = (e, id) => {
        if (e.key === 'Enter' || e.key === 'Tab' || e.key === ' ') {
            e.preventDefault();
            addInput();
        }
    };

    const deleteInput = () => {
        if (inputs.length > 1) {
            const newInputs = inputs.slice(0, -1);
            setInputs(newInputs);
        }
    };

    const handleInputChange = (id, value) => {
        const newInputs = inputs.map(input => {
            if (input.id === id) {
                return { ...input, value };
            }
            return input;
        });
        setInputs(newInputs);
    };

    const calculate = () => {
        let totalAmount = 0;
        inputs.forEach(input => {
            const amount = parseFloat(input.value);
            if (!isNaN(amount)) {
                totalAmount += amount;
            }
        });

        const kar = totalAmount * (karOran / 100);
        const karliFiyat = totalAmount + kar;
        const vergi = karliFiyat * 0.15;
        const sonFiyat = karliFiyat + vergi;

        return {
            totalAmount,
            kar,
            karOran,
            karliFiyat,
            vergi,
            sonFiyat
        };
    };

    const generateRandomNumber = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    const handleSave = async () => {
        const { totalAmount, kar, karOran, vergi, sonFiyat} = calculate();
        const productNameWithRandomNumber = productName + '#' + generateRandomNumber();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: productNameWithRandomNumber,
                price: totalAmount,
                kar,
                karOran: karOran,
                vergi,
                total: sonFiyat,
                description: productDescription
            })
        };

        try {
            const response = await fetch('https://fixxer-api.vercel.app/product', requestOptions);
            const data = await response.json();
            if (response.ok) {
                setRedirect(true);
            }
            console.log('Product saved:', data);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    if (redirect) {
        return <Navigate to="/products"/>
    }

    const tags = userInfo?.tags;

    const isAdmin = tags?.includes('admin');
    const isEditor = tags?.includes('editor') || isAdmin;
    const isWriter = tags?.includes('writer') || isEditor;
    const isUser = tags?.includes('user') || isWriter;

    return (
        <div className="container">
            <h1 className='head2 topHead'>Kar ve Vergi Hesaplama</h1>
            <div id="inputArea">
                {inputs.map(input => (
                    <div key={input.id} className="buttonArea">
                        <input
                            type="number"
                            className="amount"
                            placeholder="Miktarı girin..."
                            value={input.value}
                            onKeyDown={e => handleKeyPress(e, input.id)}
                            onChange={e => handleInputChange(input.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="newbuttonarea">
                <div className="newdelbuttons">
                    <button className="new-value" onClick={addInput}>Yeni Değer Ekle</button>
                    <button className="delete-value" onClick={deleteInput}>Son Değeri Sil</button>
                </div>
            </div>
            <div>
                <div className="karOran">
                    <label>Kar oranı:</label>
                    <input
                        type="number"
                        className="kar"
                        value={karOran}
                        max="100"
                        min="0"
                        readOnly
                    />
                    <div className="karbuttons">
                        <button className="kararttir" onClick={() => setKarOran(prev => prev + 5)}>↑</button>
                        <button className="kazalt" onClick={() => karOran > 0 && setKarOran(prev => prev - 5)}>↓</button>
                    </div>
                </div>
            </div>
            {isWriter && (
                <>
                    <div className="newbuttonarea">
                        <input type="text" placeholder='Isim' value={productName} onChange={e => setProductName(e.target.value)} />
                        <input type="text" placeholder='Acıklama (Zorunlu değil!)' value={productDescription} onChange={e => setProductDescription(e.target.value)} />
                    </div>
                    <div className="newbuttonarea">
                        <button className="calcButton" onClick={handleSave}>Kaydet</button>
                    </div>
                </>
            )}
            {calculate() && (
                <div className="result">
                    <p className="info">
                        <strong>Kar ve Vergisiz Toplam:</strong> <span className="tb">{calculate().totalAmount.toFixed(0)} $</span>
                    </p>
                    <p className="danger1">
                        <strong>Kar ({karOran}% eklenecek kar):</strong> <span className="tb">{calculate().kar.toFixed(2)} $ <span style={{ color: 'white' }}>|</span><span style={{ color: 'white', fontSize: 'x-small' }}> Toplam:</span> {calculate().karliFiyat.toFixed(2)} $</span>
                    </p>
                    <p className="danger">
                        <strong>Vergi (Karlı fiyata 15% eklenecek):</strong> <span className="tb">{calculate().vergi.toFixed(2)} $</span>
                    </p>
                    <p className="total">
                        <strong>Toplam Fiyat (Karlı Fiyat + Vergi):</strong> <span className="tb">{calculate().sonFiyat.toFixed(2)} $</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default NewProduct;