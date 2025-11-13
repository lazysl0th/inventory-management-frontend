import { useContext } from "react";
import { Navigate, useLocation} from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import useAccess from '../../hooks/useAccess'


const ProtectedRoute = ({ isLoading, children }) => {
    const currentUser = useContext(CurrentUserContext);
    const location = useLocation();
    const { isAdmin } = useAccess([{}])
    return ( 
        <Container className="d-flex">
            {isLoading 
                ? (<Spinner animation="border" className="mx-auto"/>)
                : !currentUser.loggedIn
                    ? (<Navigate to='/sign-in' replace />)
                    : location.pathname == '/admin' && !isAdmin
                        ? (<Navigate to='/sign-in' replace />)
                        : children}
        </Container>)
};

export default ProtectedRoute;