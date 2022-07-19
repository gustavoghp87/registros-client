import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { FaUserAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
// import { SearchBar } from './SearchBar'
import { useAuth } from '../../context/authContext'
import { generalBlue } from '../../config'
import { logoutService } from '../../services'
import { typeAppDispatch, typeRootState, typeUser } from '../../models'

export const NavBar = () => {

    const user: typeUser|undefined = useAuth().user
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const color = '#fbfbfb'
    
    const logoutHandler = async (): Promise<void> => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: "confirm",
            title: "¿Cerrar sesión?",
            message: "",
            execution: () => {
                logoutService()
                window.location.href = '/acceso'
            }
        }))
    }
    
    return (
        <Navbar style={{ backgroundColor: generalBlue }} collapseOnSelect expand={'lg'}>

            <Navbar.Brand href={'/'} style={{ color }}>
                &nbsp; INICIO
            </Navbar.Brand>

            <Navbar.Toggle aria-controls={"responsive-navbar-nav"} />
            
            <Navbar.Collapse id={"responsive-navbar-nav"}>
                <Nav className={'mr-auto'}>
                    <Nav.Link className={user && user.isAuth ? '' : 'd-none'} href={'/index'} style={{ color }}>
                        &nbsp; &nbsp;Territorios&nbsp; &nbsp;
                    </Nav.Link>

                    <Nav.Link className={((user && !user.isAuth) || !user) ? '' : 'd-none'} href={'/acceso'} style={{ color }}>
                        &nbsp; &nbsp;Entrar&nbsp; &nbsp;
                    </Nav.Link>

                    <Nav.Link className={user && user.role === 1 ? '' : 'd-none'} href={'/estadisticas'} style={{ color, margin: isMobile ? '8px 0' : '0' }}>
                        &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
                    </Nav.Link>
                    <Nav.Link className={user && user.role === 1 ? '' : 'd-none'} href={'/admins'} style={{ color }}>
                        &nbsp; &nbsp;Administradores&nbsp; &nbsp;
                    </Nav.Link>
                </Nav>

                <Nav.Link href={'/usuario'}
                    className={`d-flex align-items-center ${user && user.isAuth ? '' : 'd-none'}`}
                    style={ isMobile ? {
                        marginBottom: '15px', paddingLeft: '13px', marginTop: '10px'
                    } : {
                        marginBottom: '0', paddingLeft: '', marginTop: ''
                    }}
                >
                    <span className={'mb-1'} style={{ display: isMobile ? 'none' : '' }}>
                        <FaUserAlt size={'17px'} color={'lightgray'} />
                        &nbsp;&nbsp;
                    </span>
                    <span style={{ color }}> Mi Usuario </span> &nbsp;
                </Nav.Link>

                <Nav className={user && user.isAuth ? '' : 'd-none'}>
                    <Form>
                        <Button variant={'outline-info'} style={{ color, borderColor: color }} onClick={() => logoutHandler()}>
                            CERRAR SESIÓN
                        </Button>
                    </Form>
                </Nav>

            </Navbar.Collapse>
        </Navbar>
    )
}
