import { generalBlue } from '../../constants'
import { logoutReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { useState } from 'react'

const color = '#fbfbfb'

export const NavBar = () => {
    const { config, isMobile, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)
    
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
                        {user.isAuth ?
                            <>
                                <Nav.Link
                                    onClick={() => navigateHandler('/selector')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Territorios&nbsp; &nbsp;
                                </Nav.Link>
                                
                                {!!config.googleBoardUrl &&
                                    <Nav.Link
                                        onClick={() => navigateHandler('/tablero')}
                                        style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                    >
                                        &nbsp; &nbsp;Tablero&nbsp; &nbsp;
                                    </Nav.Link>
                                }
                            </>
                            :
                                <Nav.Link
                                    onClick={() => navigateHandler('/acceso')}
                                    style={{ color }
                                }>
                                    &nbsp; &nbsp;Entrar&nbsp; &nbsp;
                                </Nav.Link>
                        }

                        {user.isAdmin &&
                            <Nav.Link
                                onClick={() => navigateHandler('/admins')}
                                style={{ color, margin: isMobile ? '8px 0' : '0' }}
                            >
                                &nbsp; &nbsp;Administradores&nbsp; &nbsp;
                            </Nav.Link>
                        }
                    </Nav>

                    {user.isAuth &&
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
