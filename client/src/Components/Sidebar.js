import React, { useEffect, useState } from 'react'
import logo from './logo.png'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
    const [activeLink, setActiveLink] = useState(0);

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
                    <h3>Home</h3>
                </Link>
                <Link to={"/new"} onClick={() => handleLinkClick(1)} className={activeLink === 1 ? 'active' : ''}>
                    <span class="material-symbols-outlined">
                        edit_square
                    </span>
                    <h3>New Note</h3>
                </Link>
                <Link to={"/contact"} onClick={() => handleLinkClick(2)} className={activeLink === 2 ? 'active' : ''}>
                    <span class="material-symbols-outlined">
                        contact_mail
                    </span>
                    <h3>Profil</h3>
                </Link>
                <Link to={"/report"} onClick={() => handleLinkClick(4)} className={activeLink === 4 ? 'active' : ''}>
                    <span class="material-symbols-outlined">
                        report
                    </span>
                    <h3>Report</h3>
                </Link>
                <Link to={"/"} onClick={() => handleLinkClick(0)} className={activeLink === 0 ? '' : ''}>
                    <span class="material-symbols-outlined">
                        logout
                    </span>
                    <h3>Logout</h3>
                </Link>  
                
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