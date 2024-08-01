import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

function Logout() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(UserContext);  // Get setIsLoggedIn from context

    useEffect(() => {
        console.log('Logout component rendered');
        localStorage.removeItem('user');
        setIsLoggedIn(false);  // Set isLoggedIn to false when the user logs out
        navigate('/home');
    }, [navigate, setIsLoggedIn]);

    return (
        <div>
            Logging Out!!
        </div>
    );
}

export default Logout;