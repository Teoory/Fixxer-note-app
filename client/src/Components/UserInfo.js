import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';

const UserInfo = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
  
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

    const { username, tags } = userInfo;

    const checkProfile = () => {
      setInterval(() => {
        fetch(`https://fixxer-api.vercel.app/profile/${username}`, {
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
      }, 5000);
    }

    checkProfile();
  
    return null;
}

export default UserInfo