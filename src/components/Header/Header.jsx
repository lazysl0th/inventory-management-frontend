import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Nav, Navbar, Form, InputGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { FaSearch } from 'react-icons/fa';
import FormValidation from '../FormValidator/FormValidator';
import { searchSchema } from '../../utils/validationSchema';
import { link, roles } from '../../utils/constants';
import { hasAdminRole } from '../../utils/utils';
import './Header.css';

function Header({ onLog }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { t: ts } = useTranslation("search");
    const { t: ta } = useTranslation("auth");
    const { t: tad } = useTranslation("admin");

    const currentUser = useContext(CurrentUserContext);
    const [initialValues] = useState({ searchQuery: '' })
    const [expanded, setExpanded] = useState(false);

    const isPageWithoutHeader = [link.SIGNIN, link.SIGNUP, link.DELETE_USER_DATA, link.PASSWORD_RESET, link.PASSWORD_CHANGE].includes(location.pathname);

    const expandedHadle = () => setExpanded(false);

    const hadleLogout = () => {
        onLog();
        expandedHadle();
    }
    const handleSearch = async ({ searchQuery }) => navigate(`${link.SEARCH}?q=${encodeURIComponent(searchQuery)}`)

    if (isPageWithoutHeader) return null

    return (
        <Navbar variant='light' expand='md' expanded={expanded} onToggle={setExpanded} className='pt-5 pb-3'>
            <Container>
                <Navbar.Brand href='/' className='text-wrap flex-grow-1 flex-md-basis-0'><h2 className='mb-0'>Inventory Management</h2></Navbar.Brand>
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
                                            placeholder={ts("placeholders.search")}
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
                        {(currentUser?.loggedIn) 
                            ? <>{ (location.pathname !== '/profile')
                                    ? ( <>
                                        <Navbar.Text className='ps-2'>
                                            {ta("text.signedInAs")}: <a href="/profile">{currentUser?.name}</a>
                                        </Navbar.Text>
                                        <Navbar.Text className='ps-2'>
                                            {ta("text.headerEmail")}: <a href={`mailto:${currentUser?.email}`}>{currentUser?.email}</a>
                                        </Navbar.Text>
                                    </> )
                                    : (hasAdminRole([roles.ADMIN], currentUser)
                                        && (<Nav.Link 
                                                className='text-dark ms-2' 
                                                href='/admin' 
                                                onClick={expandedHadle}>
                                               {tad("links.admin")}
                                            </Nav.Link> ))}
                                <Nav.Link as="button" className='text-dark' onClick={hadleLogout}>
                                    {ta("links.signout")}
                                </Nav.Link>
                                </>
                            : ( <>
                                    <Nav.Link 
                                        className='align-self-end text-dark' 
                                        href='/sign-in' 
                                        onClick={expandedHadle}>
                                            {ta("links.signin")}
                                    </Nav.Link>
                                    <Nav.Link
                                        className='align-self-end text-dark'
                                        href='/sign-up'
                                        onClick={expandedHadle}>
                                            {ta("links.signup")}
                                    </Nav.Link>
                                </>) }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
