import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Add this line

    useEffect(() => {
        const token = localStorage.getItem('user');
        if (token) {
            setIsLoggedIn(true);  // Set isLoggedIn to true if there's a token in local storage
        }
        else {
            setIsLoggedIn(false);
        }
        if (!user) {
            axios.get('/profile').then(({ data }) => {
                setUser(data);
            }).catch(err => console.log(err));
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
}