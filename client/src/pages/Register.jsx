import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const [data,setData] = useState({
        name:'',
        email:'',
        password:''
    })
    const registerUser = async (e) => {
        e.preventDefault()
        const {name,email,password} = data
        try{
            const {data} = await axios.post('/register',{name,email,password})
            if(data.err){
                return toast.error(data.err)
            }
            else{
                setData({name:'',email:'',password:''})
                navigate('/login')
                return toast.success('Login Successful!')
            }
        }
        catch(err){
            console.log(err)
        }
    }
    return (
        <div className="flex items-center justify-center h-screen bg-gray-200 relative">
            <div className="bg-white p-8 rounded shadow-md w-80 absolute">
                <form onSubmit={registerUser} className="flex flex-col justify-between h-full">
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                            <input type="text" placeholder='Enter Name...' value = {data.name} onChange={(e)=> setData({...data,name:e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                            <input type="email" placeholder='Enter Email...' value = {data.email} onChange={(e)=> setData({...data,email:e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        <div className="mb-10">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input type="password" placeholder='Enter Password...' value = {data.password} onChange={(e)=> setData({...data,password:e.target.value})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register