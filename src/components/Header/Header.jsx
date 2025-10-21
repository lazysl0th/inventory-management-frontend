import { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, Form, Button} from 'react-bootstrap';
import { CurrentUserContext } from '../../context/CurrentUserContext';

import './Header.css';

function Header({ onSignout }) {
    const location = useLocation();
    const currentUser = useContext(CurrentUserContext);
    const [expanded, setExpanded] = useState(false);

    const isAuthPage = ['/signin', '/signup'].includes(location.pathname);

    function clickHadler() {
        setExpanded(false);
    }

    function signoutHander() {
        onSignout();
        clickHadler();
    }

    if (isAuthPage) return null

    return (
        <Navbar variant='light' expand='md' expanded={expanded} onToggle={setExpanded}>
            <Container className=''>
                <Navbar.Brand href='/' className='text-wrap flex-grow-1 flex-md-basis-0'>Inventory Management</Navbar.Brand>
                <Navbar.Toggle className='' aria-controls='main-navbar-nav' />
                <Navbar.Collapse id='main-navbar-nav' className="justify-content-end">
                    <Nav className='align-items-end align-items-md-center'>
                        <Form className="pt-2 pt-md-0">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                        </Form>
                        {currentUser?.loggIn ? (
                            <>
                                <Navbar.Text className='ps-2'>
                                    Signed in as: <a href="#login">{currentUser?.name}</a>
                                </Navbar.Text>
                                <Navbar.Text className='ps-2'>
                                    Email: <a href={`mailto:${currentUser?.email}`}>{currentUser?.email}</a>
                                </Navbar.Text>
                                <Nav.Link href='/' className='align-self-end' onClick={signoutHander}>Sign Out</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link className='align-self-end' href='/signin' onClick={clickHadler}>Sign In</Nav.Link>
                                <Nav.Link className='align-self-end' href='/signup' onClick={clickHadler}>Sign Up</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
