import { useEffect, useState, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UserContext } from '../Hooks/UserContext';


const ProfilPage = () => {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const { setUserInfo, userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch(`https://fixxer-api.vercel.app/profile/${username}`)
            .then(response => response.json())
            .then(data => setUserProfile(data));
    }, [username]);


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
        fetch(`https://fixxer-api.vercel.app/profile/${username}`)
            .then(response => response.json())
            .then(data => setUserProfile(data));
    }, [username]);

    if (!userInfo) {
        return <Navigate to="/" />;
    }

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    const { user } = userProfile;
    
    return (
        <div className='user-profile-page'>
            <div className="ProfilePageMain">
                <h1>Profil</h1>
                <div className="ProfileCard">
                    <div className="infoArea">
                        <div className="username">{userInfo.username}</div>
                        <div className="email">{userInfo.email}</div>
                        <div className={`tags ${userInfo.tags.join(' ')}`}>{userInfo.tags}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilPage