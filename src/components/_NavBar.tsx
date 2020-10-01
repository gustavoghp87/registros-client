import React from 'react'
import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { SERVER } from '../config.json'
import { useSelector } from 'react-redux'
import { IUser, IState } from '../hoc/types'
import { FaUserAlt } from 'react-icons/fa'


function NavBar() {

  const user:IUser = useSelector((state:IState) => state.user.userData)

  const history = useHistory()

  const logoutHandle = async () => {
    const axios = await Axios.post(`${SERVER}/api/users/logout`, {token:document.cookie})
    const response = axios.data.response
    if (response==="ok") {
      alert("Sesión de usuario cerrada con éxito")
      history.push("/login")
    } else {
      alert("Algo falló y no cerró sesión")
    }
  }


  return (
    <div style={{position:'fixed', width:'100%', zIndex:2}}>
      <Navbar bg="dark" variant="dark" collapseOnSelect expand="lg">
        <Navbar.Brand href="/">&nbsp; INICIO</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="mr-auto">

            {user && user.isAuth &&
              <Nav.Link href="/index">&nbsp; &nbsp;Territorios&nbsp; &nbsp;</Nav.Link>
            }

            {user && !user.isAuth &&
              <Nav.Link href="/login">&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>
            }

            {!user &&
              <Nav.Link href="/login">&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>
            }

            {user && user.role===1 &&
              <>
              <Nav.Link href="/estadisticas" style={{margin: window.screen.width<989 ? '8px 0' : '0'}}>
                &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
              </Nav.Link>
              <Nav.Link href="/admins">&nbsp; &nbsp;Administradores&nbsp; &nbsp;</Nav.Link>
              </>
            }
          </Nav>

          {user && user.isAuth &&
            <>
            <Nav.Link href="/user" style={{display:'flex', alignItems:'center', marginBottom: window.screen.width<992 ? '12px' : '0'}}>
              <FaUserAlt size="17px" color="gray" />
              &nbsp; Mi Usuario &nbsp;
            </Nav.Link>

            <Nav>
              <Form inline>
                <Button variant="outline-info" onClick={()=>logoutHandle()}>CERRAR SESIÓN</Button>
              </Form>
            </Nav>
            </>
          }

        </Navbar.Collapse>
      </Navbar>
      

      {user && user.isAuth &&
        <div style={{position:'fixed', right:'0', marginRight:'18px', marginTop:'5px', zIndex:1}}>
          <p style={{textAlign:'right', marginBottom:'0'}}> {user.email} </p>
          <p style={{textAlign:'right', marginBottom:'0'}}> Grupo: {user.group} </p>
          <p style={{textAlign:'right'}}> {user.role ? "Administrador" : ""} </p>
        </div>
      }

    </div>
  )
}


export default NavBar
