import React, { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Editor from './Editor';

function Dashboard() {
    console.log("rendering dashboard");
    const navigateToEditor = (id,title,text) => {
        navigate(`/editor`);
        handletitlechange(title);
        handlechange(text);
    }
    
    const { user, setUser: setUserContext } = useContext(UserContext);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    const setUser = useCallback(setUserContext, []);

    useEffect(() => {
        axios.get('/profile').then(({ data }) => {
            setUser(data);
            if (data) {
                axios.get('/getFiles') 
                    .then(({ data }) => {
                        setFiles(data);
                    })
                    .catch(err => console.error("Error fetching files:", err));
            }
        }).catch(err => console.log(err));
    }, [setUser]);

    const handleCreateNewFile = () => {
        navigate('/editor');
    };

    return (
       <div className="pt-16 p-8">
    {!!user && ( <h2 className="text-2xl mb-2"> Welcome {user.name}</h2> )}
    <h3 className="text-xl mb-2">My Work</h3>
    <div className="flex flex-wrap mb-4">
        <button className="mr-2 mb-2 text-black border-0.5  font-bold py-2 px-4 rounded w-48 h-24 flex items-center justify-center bg-transparent border border-white hover:bg-blue-500 hover:bg-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105" onClick={handleCreateNewFile}>
            <div className="flex flex-col items-center justify-center">
                <span className="text-4xl">+</span>
                <span className="text-sm">Create New File</span>
            </div>
        </button>
        {files && files.length > 0 && files.filter(file => file.user === user.id).map(file => (
        <button key={file._id} className="mr-2 mb-2 border-0.5  text-black font-bold py-2 px-4 rounded w-48 h-24 flex items-center justify-center bg-transparent border border-white hover:bg-blue-500 hover:bg-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105" onClick={() => navigate(`/editor/${file.uuid}`)}>
            {file.title} 
        </button>
))}
    </div>
    <div>
        <h3 className="text-xl mb-2">Shared With Me</h3>
        {files && files.length > 0 && files.filter(file => file.user !== user.id).map(file => (
        <button key={file._id} className="mr-2 mb-2 border-0.5  text-black font-bold py-2 px-4 rounded w-48 h-24 flex items-center justify-center bg-transparent border border-white hover:bg-blue-500 hover:bg-opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105" onClick={() => navigate(`/editor/${file.uuid}`)}>
            {file.title} 
        </button>
))}
    </div>
</div>
    );
}

export default Dashboard;