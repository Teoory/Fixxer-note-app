import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../Hooks/UserContext';
import logo from './logo.png';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [activeLink, setActiveLink] = useState(0);
    
    useEffect(() => {
        fetch('https://fixxer-api.vercel.app/profile', {
            credentials: 'include',
        }).then(response => {
                response.json().then(userInfo => {
                    setUserInfo(userInfo);
                });
            })
    }, []);

    
    function logout() {
        fetch('https://fixxer-api.vercel.app/logout', {
            credentials: 'include',
            method: 'POST',
        }).then(() => {
            setUserInfo(null);
        });
        handleLinkClick(0);
    }

    const tags = userInfo?.tags;
    const username = userInfo?.username;

    const isAdmin = tags?.includes('admin');
    const isEditor = tags?.includes('editor') || isAdmin;
    const isWriter = tags?.includes('writer') || isEditor;
    const isUser = tags?.includes('user') || isWriter;

    useEffect(() => {
        const sideMenu = document.querySelector('aside');
        const menuBtn = document.getElementById('menu-btn');
        const closeBtn = document.getElementById('close-btn');
        const darkMode = document.querySelector('.dark-mode');

        const handleMenuClick = () => {
            sideMenu.style.display = 'block';
        };

        const handleCloseClick = () => {
            sideMenu.style.display = 'none';
        };

        const handleDarkModeClick = () => {
            document.body.classList.toggle('dark-mode-variables');
            darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
            darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
        };

        menuBtn.addEventListener('click', handleMenuClick);
        closeBtn.addEventListener('click', handleCloseClick);
        darkMode.addEventListener('click', handleDarkModeClick);

        return () => {
            menuBtn.removeEventListener('click', handleMenuClick);
            closeBtn.removeEventListener('click', handleCloseClick);
            darkMode.removeEventListener('click', handleDarkModeClick);
        };
    }, []);

    const handleLinkClick = (index) => {
        setActiveLink(index);
    };
    
    return (
    <div className="asideContainer">
        <aside>
            <div className="toggle">
                <div className="logo">
                    <img src={logo} alt="logo" />
                    <h2>Fixxer <span className='success'>Page</span></h2>
                </div>
                <div className="close" id='close-btn'>
                    <span className='material-symbols-outlined'>
                        close
                    </span>
                </div>
            </div>

            <div className="menu">
                <Link to={"/"} onClick={() => handleLinkClick(0)} className={activeLink === 0 ? 'active' : ''}>
                    <span class="material-symbols-outlined">
                        home
                    </span>
                    <h3>Notes</h3>
                </Link>
                <Link to={"/products"} onClick={() => handleLinkClick(6)} className={activeLink === 6 ? 'active' : ''}>
                    <span class="material-symbols-outlined">
                        topic
                    </span>
                    <h3>Products</h3>
                </Link>

                <Link to={"/newproduct"} onClick={() => handleLinkClick(5)} className={activeLink === 5 ? 'active' : ''}>
                    <span class="material-symbols-outlined">
                        calculate
                    </span>
                    <h3>Hesaplama</h3>
                </Link>

                {isWriter && (
                    <Link to={"/new"} onClick={() => handleLinkClick(1)} className={activeLink === 1 ? 'active' : ''}>
                        <span class="material-symbols-outlined">
                            edit_square
                        </span>
                        <h3>New Note</h3>
                    </Link>
                )}

                {isUser && (
                <>
                    <Link to={`/profile/${username}`} onClick={() => handleLinkClick(2)} className={activeLink === 2 ? 'active' : ''}>
                        <span class="material-symbols-outlined">
                            contact_mail
                        </span>
                        <h3>Profil</h3>
                    </Link>
                    
                    <Link to={"/contact"} onClick={() => handleLinkClick(4)} className={activeLink === 4 ? 'active' : ''}>
                        <span class="material-symbols-outlined">
                            report
                        </span>
                        <h3>Report</h3>
                    </Link>

                    {isAdmin && (
                        <Link to={"/helpdesk"} onClick={() => handleLinkClick(7)} className={activeLink === 7 ? 'active' : ''}>
                            <span class="material-symbols-outlined">
                                admin_panel_settings
                            </span>
                            <h3>HelpDesk</h3>
                        </Link>
                    )}

                    <a onClick={logout} className={activeLink === 0 ? '' : ''}>
                        <span class="material-symbols-outlined">
                            logout
                        </span>
                        <h3>Logout</h3>
                    </a>
                </>
                )}

                {!isUser && (
                    <Link to={"/login"} onClick={() => handleLinkClick(3)} className={activeLink === 3 ? 'active' : ''}>
                        <span class="material-symbols-outlined">
                            login
                        </span>
                        <h3>Login</h3>
                    </Link>
                )}


                
                <div className="dark-mode">
                    <span class="material-symbols-outlined active">
                        dark_mode
                    </span>
                    <span class="material-symbols-outlined">
                        light_mode
                    </span>
                </div>          
            </div>
        </aside>

        <div className="nav">
            <button id="menu-btn">
                <span class="material-symbols-outlined">
                    menu
                </span>
            </button>
            <div className="dark-mode">
                <span class="material-symbols-outlined active">
                    dark_mode
                </span>
                <span class="material-symbols-outlined">
                    light_mode
                </span>
            </div>
        </div>
    </div>
    )
}

export default Sidebar