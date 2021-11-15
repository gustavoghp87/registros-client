import { useState, useEffect } from 'react'
import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaUserAlt } from 'react-icons/fa'
import { logoutService } from '../services/userServices'
import { isMobile } from '../services/functions'
import { typeUser, typeState } from '../models/typesUsuarios'

export const NavBar = () => {

  const history = useHistory()
  const user: typeUser = useSelector((state: typeState) => state.user.userData)
  const [scrollDown, setScrollDown] = useState<boolean>(false)

  const logoutHandler = async () => {
    await logoutService()
    history.push("/login")
  }

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 100) setScrollDown(true)
      else setScrollDown(false)
    })
  }, [])


  return (
    <div style={{position:'fixed', width:'100%', zIndex:4}}>
      <Navbar style={{backgroundColor:"#4a6da7"}} collapseOnSelect expand="lg">
        <Navbar.Brand href="/" style={{color:'#fbfbfb'}}>&nbsp; INICIO</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="mr-auto">

            {user && user.isAuth &&
              <Nav.Link href="/index" style={{color:'#fbfbfb'}}>&nbsp; &nbsp;Territorios&nbsp; &nbsp;</Nav.Link>
            }

            {user && !user.isAuth &&
              <Nav.Link href="/login" style={{color:'#fbfbfb'}}>&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>
            }

            {!user &&
              <Nav.Link href="/login" style={{color:'#fbfbfb'}}>&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>
            }

            {user && user.role === 1 &&
              <>
              <Nav.Link href="/estadisticas" style={{color:'#fbfbfb', margin: isMobile ? '8px 0' : '0'}}>
                &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
              </Nav.Link>
              <Nav.Link href="/admins" style={{color:'#fbfbfb'}}>&nbsp; &nbsp;Administradores&nbsp; &nbsp;</Nav.Link>
              </>
            }
          </Nav>

          {user && user.isAuth &&
            <>
            <Nav.Link href="/user" style={{display:'flex', alignItems:'center', marginBottom: isMobile ? '12px' : '0'}}>
              <span style={{display: isMobile ? 'none' : 'block'}}>
                <FaUserAlt size="17px" color="lightgray" />
                &nbsp;&nbsp;
              </span>
              
              <span style={{color:'#fbfbfb'}}> Mi Usuario </span> &nbsp;
            </Nav.Link>

            <Nav>
              <Form inline>
                <Button variant="outline-info" style={{color:'#fbfbfb', borderColor:'#fbfbfb'}} onClick={() => logoutHandler()}>
                  CERRAR SESIÓN
                </Button>
              </Form>
            </Nav>
            </>
          }
        </Navbar.Collapse>
      </Navbar>
      

      {user && user.isAuth && ((isMobile && !scrollDown) || !isMobile)
        ?
        <div style={{position:'fixed', right:'0', marginRight:'18px', marginTop:'5px', zIndex:1}}>
          <p style={{textAlign:'right', marginBottom:'0'}}> {user.email} </p>
          <p style={{textAlign:'right', marginBottom:'0'}}> Grupo: {user.group} </p>
          <p style={{textAlign:'right'}}> {user.role ? "Administrador" : ""} </p>
        </div>
        :
        <></>
      }

    </div>
  )
}
