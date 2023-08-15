import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { generalBlue, typeAppDispatch, typeRootState } from '../../models'
import { useState } from 'react'

export const NavBar = () => {

    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [expanded, setExpanded] = useState(false)
    const color = '#fbfbfb'
    
    const openLogoutConfirmModal = (): void => {
        setExpanded(false)
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Cerrar sesión?",
            message: "",
            execution: () => logoutHandler()
        }))
    }

    const logoutHandler = () => {
        dispatch(logoutReducer())
        navigate('/acceso')
    }

    const navigateHandler = (url: string): void => {
        setExpanded(false)
        navigate(url)
    }
    
    return (
        <Navbar expanded={expanded} style={{ backgroundColor: generalBlue }} expand={'lg'}>

            <Container fluid>

                <Navbar.Brand className={'pointer'} onClick={() => navigateHandler('/')} style={{ color }}>
                    &nbsp;&nbsp; INICIO
                </Navbar.Brand>

                <Navbar.Toggle onClick={() => setExpanded(x => !x)} />
                
                <Navbar.Collapse>
                    <Nav className={'me-auto'}>
                        {user && user.isAuth ?
                            <>
                                <Nav.Link
                                    onClick={() => navigateHandler('/selector')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Territorios&nbsp; &nbsp;
                                </Nav.Link>
                                
                                <Nav.Link
                                    onClick={() => navigateHandler('/congregacion')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Tablero&nbsp; &nbsp;
                                </Nav.Link>
                            </>
                            :
                                <Nav.Link
                                    onClick={() => navigateHandler('/acceso')}
                                    style={{ color }
                                }>
                                    &nbsp; &nbsp;Entrar&nbsp; &nbsp;
                                </Nav.Link>
                        }

                        {user && user.isAdmin &&
                            <Nav.Link
                                onClick={() => navigateHandler('/admins')}
                                style={{ color, margin: isMobile ? '8px 0' : '0' }}
                            >
                                &nbsp; &nbsp;Administradores&nbsp; &nbsp;
                            </Nav.Link>
                        }
                    </Nav>

                    {user && user.isAuth &&
                        <Nav >
                            <Nav.Link className={''}
                                onClick={() => navigateHandler('/usuario')}
                                style={{
                                    margin: isMobile ? '8px 0' : 0,
                                    paddingLeft:  isMobile ? '13px' : 0
                                }}
                            >
                                <span style={{ color }}> Mi Usuario </span> &nbsp;&nbsp;&nbsp;
                            </Nav.Link>
                            
                            <Button
                                className={`${isMobile ? 'my-3' : ''}`}
                                onClick={() => openLogoutConfirmModal()}
                                style={{ color, borderColor: color }}
                                variant={'outline-info'}
                            >
                                CERRAR SESIÓN
                            </Button>
                        </Nav>
                    }
                </Navbar.Collapse>

            </Container>
        </Navbar>
    )
}
