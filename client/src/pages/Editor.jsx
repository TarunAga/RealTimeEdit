import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import axios from "axios";
import 'react-quill/dist/quill.snow.css';
import CustomToolbar from '../components/CustomToolbar';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import ShareComponent from './ShareComponent';
import {io} from 'socket.io-client';
import { toast } from "react-hot-toast";

const Editor = () => {

    const [showShareComponent, setShowShareComponent] = useState(false);
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const navigate = useNavigate();
    const [socket, setSocket] = useState();
    console.log('Component rendering');
    const quillRef = useRef(null);
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            localStorage.setItem('editorId', id);
        }
    }, [id]);

    useEffect(() => {
        console.log('useEffect running');
        const newSocket = io('http://localhost:8000');
        setSocket(newSocket);
        newSocket.on('connect', () => {
            console.log('Connected to Socket.IO server');
            newSocket.emit('joinRoom', id); 
        });
          
        newSocket.on('bcast', (message) => {
        console.log(message,"hi");
        quillRef.current.getEditor().updateContents(message);
        });
    }, []);

    useEffect(() => {
        if (id) {
            axios.get(`/getFiles/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                })
                .catch(err => console.error("Error fetching file:", err));
        }
    }, [id]);

    const handleChange = (content, delta, source, editor) => {
        setText(content)
        console.log(source);
       if(source!="user") return;
            console.log('Emitting changes', delta);
            socket.emit('msg', {data: delta,roomId : id});
        
    };
    const handleShare = () => {
        setShowShareComponent(true);
    };
    
    const handleClose = () => {
        setShowShareComponent(false);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem('editorId');

        if(!title || !text){ 
            alert("Atleast give name and text to the file"); 
            return;
        }
    
        if(id){
            console.log('Saving with id:', id);
            const data = { title, text, id };
            const save = await axios.post('/editorsaveworkid', data);
            if(save.data.err) {
                console.log(save.data.err);
                return;
            }
        }
        else{
            const uuidf = uuidv4();
            const data = { title, text, uuidf }; 
            console.log(data);
            console.log('hifrontend')
            const save = await axios.post('/editorsavework', data);
            const id  = uuidf;
            
            if(save.data.err) {
                console.log(save.data.err);
                return;
            }
            navigate(`/editor/${id}`, { replace: true });
        }      
    };

const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this file?")) {
        const id = localStorage.getItem('editorId');
        if (id) {
            try {
                console.log(id);
                const response = await axios.post(`/deleteFile/${id}`);
                if (response.data.err) {
                    toast.error(response.data.err);
                } else {
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }
    }
};
    

    const modules = {
        toolbar: {
            container: "#toolbar",
        }
    };

    const formats = [
        'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'header', 'blockquote', 'code-block',
        'indent', 'list',
        'direction', 'align',
        'link', 'image', 'video', 'formula',
    ];

    return (
       <div className="mt-16">
    <div className="flex mb-2 items-center">
        <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter document title"
            className="w-1/5 p-2 mr-2 rounded border border-gray-300"
        />
        <button onClick={handleSave} className="p-2 mr-2 bg-white text-black border border-black rounded cursor-pointer transform hover:scale-110 transition-transform duration-200">Save</button>
<button onClick={handleShare} className="p-2 mr-2 bg-white text-black border border-black rounded cursor-pointer transform hover:scale-110 transition-transform duration-200">Share</button>
<button onClick={handleDelete} className="p-2 mr-2 bg-white text-black border border-red-500 rounded cursor-pointer transform hover:scale-110 transition-transform duration-200">Delete</button>
        {showShareComponent && <ShareComponent onClose={handleClose} />}
    </div>
    <CustomToolbar className="mb-5" />
    <div className="w-4/5 mx-auto">
        <ReactQuill
            ref={quillRef}
            value={text}
            onChange={handleChange}
            modules={modules}
            formats={formats}
        />
    </div>
    <style>
        {`
            .ql-editor {
                min-height: 70vh;
            }
        `}
    </style>
</div>
    );
};

export default Editor;