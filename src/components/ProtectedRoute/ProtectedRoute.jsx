import { useContext } from "react";
import { Navigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { CurrentUserContext } from '../../context/CurrentUserContext';


const ProtectedRoute = ({ isLoading, children }) => {
    const currentUser = useContext(CurrentUserContext);
    return ( 
        <Container className="d-flex">
            {isLoading 
            ? (<Spinner animation="border" className="mx-auto"/>)
            : currentUser.loggedIn 
                ? children 
                : (<Navigate to='/sign-in' replace />)}
        </Container>)
};

export default ProtectedRoute;