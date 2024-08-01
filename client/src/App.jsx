import { useRoutes } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext,UserContextProvider } from '../context/userContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router } from 'react-router-dom'
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
            <UserContextProvider>
          <AppRoutes />
      </UserContextProvider>
    </Router>

  );
}

function AppRoutes() {
  const { isLoggedIn } = useContext(UserContext);

  const routing = useRoutes([
      { path: '/', element: <Home /> },
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
      { path: '/logout', element: <Logout /> },
      { path: '/dashboard', element: isLoggedIn ? <Dashboard /> : <Login /> },
      { path: '/editor', element: isLoggedIn ? <Editor /> : <Login />, end: true },
      { path: '/editor/:id', element: isLoggedIn ? <Editor /> : <Login /> },
]);

  return (
      <>
          <Navbar />
          <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
          {routing}
      </>
  );
}

export default App;