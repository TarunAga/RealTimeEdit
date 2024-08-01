import { Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function PrivateRoute({ element, ...rest }) {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <Route {...rest} element={isLoggedIn ? element : <Navigate to="/login" />} />
    );
}

export default PrivateRoute;