import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserAlt } from 'react-icons/fa'
import { logout, setValuesAndOpenAlertModalReducer } from '../../store'
import { generalBlue } from '../../config'
import { typeAppDispatch, typeRootState } from '../../models'

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
        dispatch(logout())
        navigate('/acceso')
    }
    
    return (
        <Navbar style={{ backgroundColor: generalBlue }} collapseOnSelect expand={'lg'}>

            <Navbar.Brand onClick={() => navigate('/')} style={{ color, cursor: 'pointer' }}>
                &nbsp; INICIO
            </Navbar.Brand>

            <Navbar.Toggle />
            
            <Navbar.Collapse id={"responsive-navbar-nav"}>
                <Nav className={'mr-auto'}>
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
                    <>
                        <Nav.Link className={'d-flex align-items-center'}
                            onClick={() => navigate('/usuario')}
                            style={{
                                margin: isMobile ? '8px 0' : 0,
                                paddingLeft:  isMobile ? '13px' : 0
                            }}
                        >
                            {!isMobile &&
                                <span className={'mb-1'}>
                                    <FaUserAlt size={'17px'} color={'lightgray'} />
                                    &nbsp;&nbsp;
                                </span>
                            }
                            <span style={{ color }}> Mi Usuario </span> &nbsp;&nbsp;
                        </Nav.Link>
                        <Nav>
                            <Form>
                                <Button variant={`outline-info ${isMobile ? 'my-3' : ''}`}
                                    onClick={() => openLogoutConfirmModal()}
                                    style={{ color, borderColor: color }}
                                >
                                    CERRAR SESIÓN
                                </Button>
                            </Form>
                        </Nav>
                    </>
                }
                
            </Navbar.Collapse>
        </Navbar>
    )
}
