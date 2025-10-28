import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { FaSearch } from 'react-icons/fa';
import FormValidation from '../FormValidator/FormValidator';
import { searchSchema } from '../../utils/validationSchema';
import { link } from '../../utils/constants'
import './Header.css';

function Header({ onLog }) {
    const location = useLocation();
    const navigate = useNavigate();

    const currentUser = useContext(CurrentUserContext);
    const [initialValues] = useState({ searchQuery: '' })
    const [expanded, setExpanded] = useState(false);

    const isAuthPage = [link.SINGIN, link.SIGNUP].includes(location.pathname);

    const expandedHadle = () => setExpanded(false);

    const hadleLogout = () => {
        onLog();
        expandedHadle();
    }
    const handleSearch = async ({ searchQuery }) => navigate(`${link.SEARCH}?q=${encodeURIComponent(searchQuery)}`)

    if (isAuthPage) return null

    return (
        <Navbar variant='light' expand='md' expanded={expanded} onToggle={setExpanded} className='py-5'>
            <Container>
                <Navbar.Brand href='/' className='text-wrap flex-grow-1 flex-md-basis-0'>Inventory Management</Navbar.Brand>
                <Navbar.Toggle aria-controls='main-navbar-nav' />
                <Navbar.Collapse id='main-navbar-nav' className='justify-content-end'>
                    <Nav className='align-items-end align-items-md-center'>
                        <FormValidation 
                            initialValues={initialValues}
                            validationSchema={searchSchema}
                            onSubmit={handleSearch}
                            validateOnMount={true}
                        >
                            { ({ handleSubmit, values, handleChange, handleBlur, errors, isSubmitting }) => (
                                <Form className='pt-2 pt-md-0' onSubmit={handleSubmit}>
                                    <InputGroup>
                                        <Form.Control
                                            type='search'
                                            name='searchQuery'
                                            placeholder='Search'
                                            aria-label='Search'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.searchQuery}
                                        />
                                        <OverlayTrigger
                                            key='bottom'
                                            placement='bottom'
                                            trigger={['hover', 'click']}
                                            delay={{ hide: 200 }}
                                            overlay={
                                                (errors.searchQuery)
                                                ?
                                                (<Tooltip id='tooltip-error'>
                                                    {errors.searchQuery}
                                                </Tooltip>)
                                                : <Tooltip id="tooltip-empty" className="d-none" />
                                            }
                                            >
                                            <Button variant='dark' type='submit' disabled={isSubmitting}>
                                                <FaSearch/>
                                            </Button>
                                        </OverlayTrigger>
                                    </InputGroup>
                                </Form>
                            ) }
                        </FormValidation>
                        {currentUser?.loggedIn 
                        ? ( <>
                                <Navbar.Text className='ps-2' >
                                    Signed in as: <a href="#login">{currentUser?.name}</a>
                                </Navbar.Text>
                                <Navbar.Text className='ps-2'>
                                    Email: <a href={`mailto:${currentUser?.email}`}>{currentUser?.email}</a>
                                </Navbar.Text>
                                <Nav.Link className='text-dark' href='/' onClick={hadleLogout}>Sign{'\u00A0'}Out</Nav.Link>
                            </>
                        ) : (currentUser?.loggedIn || (location.pathname === '/signup' || location.pathname ==='/signin'))
                                ? (<></>)
                                : ( <>
                                    <Nav.Link className='align-self-end text-dark' href='/sign-in' onClick={expandedHadle}>Sign In</Nav.Link>
                                    <Nav.Link className='align-self-end text-dark' href='/sign-up' onClick={expandedHadle}>Sign Up</Nav.Link>
                                </>)

                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
