import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

const UserInfo = () => {
    const { setUserInfo } = useContext(UserContext);
  
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
  
    return null;
}

export default UserInfo