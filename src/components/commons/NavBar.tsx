import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logoutReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { generalBlue, typeAppDispatch, typeRootState } from '../../models'

export const NavBar = () => {

    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate = useNavigate()
    const color = '#fbfbfb'
    
    const openLogoutConfirmModal = (): void => {
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
    
    return (
        <Navbar style={{ backgroundColor: generalBlue }} collapseOnSelect expand={'lg'}>

            <Container fluid>

                <Navbar.Brand className={'pointer'} onClick={() => navigate('/')} style={{ color }}>
                    &nbsp;&nbsp; INICIO
                </Navbar.Brand>

                <Navbar.Toggle />
                
                <Navbar.Collapse>
                    <Nav className={'me-auto'}>
                        {user && user.isAuth ?
                            <>
                                <Nav.Link
                                    onClick={() => navigate('/index')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Territorios&nbsp; &nbsp;
                                </Nav.Link>
                                
                                <Nav.Link
                                    onClick={() => navigate('/congregacion')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Congregación&nbsp; &nbsp;
                                </Nav.Link>
                            </>
                            :
                                <Nav.Link
                                    onClick={() => navigate('/acceso')}
                                    style={{ color }
                                }>
                                    &nbsp; &nbsp;Entrar&nbsp; &nbsp;
                                </Nav.Link>
                        }

                        {user && user.isAdmin &&
                            <>
                                <Nav.Link
                                    onClick={() => navigate('/estadisticas')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
                                </Nav.Link>

                                <Nav.Link
                                    onClick={() => navigate('/admins')}
                                    style={{ color, margin: isMobile ? '8px 0' : '0' }}
                                >
                                    &nbsp; &nbsp;Administradores&nbsp; &nbsp;
                                </Nav.Link>
                            </>
                        }
                    </Nav>

                    {user && user.isAuth &&
                        <Nav >
                            <Nav.Link className={''}
                                onClick={() => navigate('/usuario')}
                                style={{
                                    margin: isMobile ? '8px 0' : 0,
                                    paddingLeft:  isMobile ? '13px' : 0
                                }}
                            >
                                <span style={{ color }}> Mi Usuario </span> &nbsp;&nbsp;&nbsp;
                            </Nav.Link>
                            
                            <Button
                                className={`${isMobile ? 'my-3' : ''}`}
                                variant={'outline-info'}
                                onClick={() => openLogoutConfirmModal()}
                                style={{ color, borderColor: color }}
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
