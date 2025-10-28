import { useContext } from "react";
import { Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const ProtectedRoute = ({ children }) => {
    const currentUser = useContext(CurrentUserContext);
    return ( currentUser.loggedIn ? children : <Navigate to='/sign-in' replace /> );
};

export default ProtectedRoute;