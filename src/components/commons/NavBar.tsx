import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { FaUserAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setValuesAndOpenAlertModalReducer } from '../../store'
import { generalBlue } from '../../config'
import { logoutService } from '../../services/userServices'
import { typeAppDispatch, typeRootState } from '../../models'
import { useNavigate } from 'react-router'

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
        logoutService()
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
                    <Nav.Link className={user && user.isAuth ? '' : 'd-none'}
                        onClick={() => navigate('/index')}
                        style={{ color }}
                    >
                        &nbsp; &nbsp;Territorios&nbsp; &nbsp;
                    </Nav.Link>

                    <Nav.Link className={((user && !user.isAuth) || !user) ? '' : 'd-none'}
                        onClick={() => navigate('/acceso')}
                        style={{ color }
                    }>
                        &nbsp; &nbsp;Entrar&nbsp; &nbsp;
                    </Nav.Link>

                    <Nav.Link className={user && user.role === 1 ? '' : 'd-none'}
                        onClick={() => navigate('/estadisticas')}
                        style={{ color, margin: isMobile ? '8px 0' : '0' }}
                    >
                        &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
                    </Nav.Link>
                    <Nav.Link className={user && user.role === 1 ? '' : 'd-none'}
                        onClick={() => navigate('/admins')}
                        style={{ color }}
                    >
                        &nbsp; &nbsp;Administradores&nbsp; &nbsp;
                    </Nav.Link>
                </Nav>

                <Nav.Link className={`d-flex align-items-center ${user && user.isAuth ? '' : 'd-none'}`}
                    onClick={() => navigate('/usuario')}
                    style={ isMobile ? {
                        marginBottom: '15px', paddingLeft: '13px', marginTop: '10px'
                    } : {
                        marginBottom: '0', paddingLeft: '', marginTop: ''
                    }}
                >
                    {isMobile &&
                        <span className={'mb-1'}>
                            <FaUserAlt size={'17px'} color={'lightgray'} />
                            &nbsp;&nbsp;
                        </span>
                    }
                    <span style={{ color }}> Mi Usuario </span> &nbsp;
                </Nav.Link>

                <Nav className={user && user.isAuth ? '' : 'd-none'}>
                    <Form>
                        <Button variant={'outline-info'} style={{ color, borderColor: color }} onClick={() => openLogoutConfirmModal()}>
                            CERRAR SESIÓN
                        </Button>
                    </Form>
                </Nav>

            </Navbar.Collapse>
        </Navbar>
    )
}
