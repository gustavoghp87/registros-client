import { useState, useEffect } from 'react'
import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { FaUserAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../../store/store'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'
import { ReturnBtn } from './ReturnBtn'
// import { SearchBar } from './SearchBar'
import { useAuth } from '../../context/authContext'
import { generalBlue } from '../_App'
import { logoutService } from '../../services/tokenServices'
import { typeUser } from '../../models/user'
import { danger } from '../../models/territory'

export const NavBar = () => {

    const user: typeUser|undefined = useAuth().user
    const [scrollDown, setScrollDown] = useState<boolean>(false)
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    useEffect(() => {
        document.addEventListener("scroll", () => {
            if (window.scrollY > 100) setScrollDown(true)
            else setScrollDown(false)
        })
        return () => setScrollDown(false)
    }, [])

    const dispatch: typeAppDispatch = useDispatch()
    
    const logoutHandler = async (): Promise<void> => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: "confirm",
            title: "¿Cerrar sesión?",
            message: "",
            execution: () => {
                logoutService()
                window.location.href = "/login"
            }
        }))
    }

    const color = '#fbfbfb'

    return (
    <>  
        <div style={{ position: 'fixed', width: '100%', zIndex: 4 }}>
            <Navbar style={{ backgroundColor: generalBlue }} collapseOnSelect expand={'lg'}>

                <Navbar.Brand href={"/"} style={{ color }}>
                    &nbsp; INICIO
                </Navbar.Brand>

                <Navbar.Toggle aria-controls={"responsive-navbar-nav"} />
                
                <Navbar.Collapse id={"responsive-navbar-nav"}>
                    <Nav className={'mr-auto'}>
                        <Nav.Link className={user && user.isAuth ? '' : 'd-none'} href={"/index"} style={{ color }}>
                            &nbsp; &nbsp;Territorios&nbsp; &nbsp;
                        </Nav.Link>

                        <Nav.Link className={((user && !user.isAuth) || !user) ? '' : 'd-none'} href={"/login"} style={{ color }}>
                            &nbsp; &nbsp;Entrar&nbsp; &nbsp;
                        </Nav.Link>

                        <Nav.Link className={user && user.role === 1 ? '' : 'd-none'} href={"/estadisticas"} style={{ color, margin: isMobile ? '8px 0' : '0' }}>
                            &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
                        </Nav.Link>
                        <Nav.Link className={user && user.role === 1 ? '' : 'd-none'} href={"/admins"} style={{ color }}>
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

            {!scrollDown && <ReturnBtn />}
        
            <div className={`row`}>

                {window.location.pathname !== '/' &&
                    <div className={`col-4 offset-6 m-auto ${(isMobile && !scrollDown) || !isMobile ? '' : 'd-none'}`}
                        style={{
                            position: 'relative',
                            zIndex: 6
                        }}
                    >
                        <Button variant={danger}
                            className={`d-block m-auto mt-2`}
                            size={isMobile ? 'sm' : undefined}
                            onClick={() => window.location.reload()}
                        >
                            Refrescar
                        </Button>
                    </div>
                }

                {user && user.isAuth && ((isMobile && !scrollDown) || !isMobile) &&
                    <div className={`col-4 ${isDarkMode ? 'text-white' : ''}`}
                        style={{
                            position: 'fixed',
                            right: '0',
                            marginRight: '18px',
                            marginTop: '5px',
                            zIndex: 1,
                            fontSize: isMobile ? '.9rem' : ''
                        }}
                    >
                        <p style={{ textAlign: 'right', marginBottom: '0' }}> {isMobile ? user.email.split('@')[0] : user.email} </p>
                        <p style={{ textAlign: 'right', marginBottom: '0' }}> Grupo {user.group} </p>
                        <p style={{ textAlign: 'right' }}> {user.role ? isMobile ? "Admin" : "Administrador" : ""} </p>
                    </div>
                }
            </div>
        </div>
    </>
    )
}
