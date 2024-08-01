import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

function Navbar() {
    const { isLoggedIn, user, setUser } = useContext(UserContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        axios.get('/profile').then(({ data }) => {
            setUser(data);
        }).catch(err => console.log(err));
    }, [setUser]);

    return (
        <nav className="bg-gray-500 fixed top-0 w-full z-50 flex justify-end p-3">
            <div className="md:hidden">
                <button className="flex justify-center items-center border border-gray-400 rounded p-1 w-12 h-8" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>≡</button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                        <div className="rounded-md bg-white shadow-xs">
                            <Link className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900" to="/">Home</Link>
                            {!isLoggedIn && <Link className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900" to="/register">Register</Link>}
                            {isLoggedIn ? <span className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900">{user ? user.name : ''}</span> : <Link className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900" to="/login">Login</Link>}
                            {isLoggedIn && <Link className="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900" to="/logout">Logout</Link>}
                        </div>
                    </div>
                )}
            </div>
            <div className="hidden md:flex">
                <Link className="flex justify-center items-center border border-gray-400 rounded p-1 w-24 h-8 mr-1" to="/">Home</Link>
                {!isLoggedIn && <Link className="flex justify-center items-center border border-gray-400 rounded p-1 w-24 h-8 mr-1" to="/register">Register</Link>}
                {isLoggedIn ? <span className="flex justify-center items-center border border-gray-400 rounded p-1 w-24 h-8 mr-1">{user ? user.name : ''}</span> : <Link className="flex justify-center items-center border border-gray-400 rounded p-1 w-24 h-8 mr-1" to="/login">Login</Link>}
                {isLoggedIn && <Link className="flex justify-center items-center border border-gray-400 rounded p-1 w-24 h-8 mr-1" to="/logout">Logout</Link>}
            </div>
        </nav>
    );
}

export default Navbar;