import { useContext } from "react";
import { Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { CurrentUserContext } from '../../context/CurrentUserContext';


const ProtectedRoute = ({ isLoading, children }) => {
    const currentUser = useContext(CurrentUserContext);
    return ( isLoading 
        ? <Spinner animation="border" className="align-self-center"/> 
        : currentUser.loggedIn 
            ? children 
            : <Navigate to='/sign-in' replace /> );
};

export default ProtectedRoute;