import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Hooks/UserContext';
import { Link } from 'react-router-dom';

const Products = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch('https://fixxer-api.vercel.app/profile', {
          credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Profile fetch failed');
            }
            return response.json();
        })
        .then(userInfo => {
            setUserInfo(userInfo);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
      }, [setUserInfo]);


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://fixxer-api.vercel.app/product');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const deleteallProducts = async () => {
        try {
            await fetch('https://fixxer-api.vercel.app/deleteallProducts', {
                method: 'DELETE',
            });
            setProducts([]);
        } catch (error) {
            console.error('Error deleting products:', error);
        }
    };

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reverse(); // En yeni ürünleri en üstte göstermek için ters çeviriyoruz.

    const openDetailModal = (product) => {
        setSelectedProduct(product);
    };

    const closeDetailModal = () => {
        setSelectedProduct(null);
    };

    const tags = userInfo?.tags;

    const isAdmin = tags?.includes('admin');
    const isEditor = tags?.includes('editor') || isAdmin;
    const isWriter = tags?.includes('writer') || isEditor;
    const isUser = tags?.includes('user') || isWriter;

    return (
        <>
        <h1 className='topHead'>Products</h1>
        <div className='ProductContent'>
            <div className="searchArea">
                <input
                    type="text"
                    className='searchBox'
                    placeholder="Arama yapın..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isWriter && (
                    <div className="addProduct">
                        <Link to="/newproduct">Add Product</Link>
                    </div>
                )}
                {isAdmin && (
                    <div className="deleteAll">
                        <button onClick={deleteallProducts}>Delete All</button>
                    </div>
                )}
            </div>
            <div className="ProductContents">
                {filteredProducts.map(product => (
                    <div className='product' key={product._id}>
                        <p className='productName'>{product.name.split('#')[0]}</p>
                        <time>{new Date(product.createdAt).toLocaleDateString()}</time>
                        <h2>Price: {product.total.toFixed(0)} $</h2>
                        <div className="detailButton">
                            <button onClick={() => openDetailModal(product)}>Details</button>
                        </div>
                    </div>
                ))}
                {selectedProduct && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={closeDetailModal}>&times;</span>
                            <h1>Product Details</h1>
                            <h2>{selectedProduct.name}</h2>
                            {selectedProduct.description && 
                            <>
                                <p><b>Description: </b>
                                {selectedProduct.description}</p>
                            </>}
                            <p className='info'>
                                <strong>Kar ve Vergisiz Toplam:</strong> <span className='tb'>{selectedProduct.price.toFixed(2)} $</span>
                            </p>
                            <p className='danger1'>
                                <strong>Kar({selectedProduct.karOran}% kar alındı):</strong> <span className='tb'>{selectedProduct.kar.toFixed(2)} $</span>
                            </p>
                            <p className='danger'>
                                <strong>Vergi(15% vergi alındı):</strong> <span className='tb'>{selectedProduct.vergi.toFixed(2)} $</span>
                            </p>
                            <p className='total'>
                                <strong>Toplam:</strong> <span className='tb'>{selectedProduct.total.toFixed(2)} $</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default Products;
