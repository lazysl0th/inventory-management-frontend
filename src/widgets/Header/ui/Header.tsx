import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Navbar, Row } from 'react-bootstrap'
import './Header.scss'
import { useSelector } from 'react-redux'
import UserInfo from './UserInfo'
import AuthActions from './AuthActions'
import { SearchForm } from '@/features/search'
import { SETTINGS } from '@/shared/config/constants'
import { HelpButton } from '@/shared/ui/HelpButton'
import { getIsAuthenticated } from '@/features/auth'

export default function Header(): React.ReactNode {
    const isAuthenticated = useSelector(getIsAuthenticated)
    const [expanded, setExpanded] = useState(false)
    const expandedHadle = () => setExpanded(false)

    return (
        <Navbar
            as={Row}
            variant='light'
            expand='lg'
            expanded={expanded}
            onToggle={setExpanded}
            className='pt-5 pb-3'
        >
            <Container className='mw-100 gap-2'>
                <Navbar.Brand
                    as={Link}
                    to={SETTINGS.routes.main}
                    className='text-wrap mx-0'
                >
                    <h2 className='mb-0 text-nowrap'>Inventory Management</h2>
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls='main-navbar-nav'
                    className='p-0 border-0'
                />
                <Navbar.Collapse
                    id='main-navbar-nav'
                    className='justify-content-end'
                >
                    <Nav className='align-items-end align-items-lg-center gap-2'>
                        <SearchForm />
                        {isAuthenticated ? (
                            <UserInfo onExpanded={expandedHadle} />
                        ) : (
                            <AuthActions onExpanded={expandedHadle} />
                        )}
                        <HelpButton />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
