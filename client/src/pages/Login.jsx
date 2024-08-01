import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/userContext';  // Import UserContext

function Login() {

  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(UserContext);  // Get setIsLoggedIn from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      if (response.data.err) {
        return toast.error(response.data.err);
      } else {
        localStorage.setItem("user", JSON.stringify(response.data.token));
        setIsLoggedIn(true);  // Set isLoggedIn to true when the user logs in
        setEmail("");
        setPassword("");
        navigate("/dashboard");
        return toast.success("Login Successful!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 relative">
      <div className="bg-white p-8 rounded shadow-md w-80 absolute">
        <form onSubmit={loginUser}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-10">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;