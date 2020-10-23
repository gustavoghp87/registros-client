import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { SERVER } from '../config'
import { useSelector } from 'react-redux'
import { typeUser, typeState } from '../hoc/types'
import { FaUserAlt } from 'react-icons/fa'
import { mobile } from './_App'


function NavBar() {

  const user:typeUser = useSelector((state:typeState) => state.user.userData)

  const history = useHistory()

  const logoutHandle = async () => {
    const axios = await Axios.post(`${SERVER}/api/users/logout`, {token:document.cookie})
    const response = axios.data.response
    if (response==="ok") {
      alert("Sesión de usuario cerrada con éxito")
      document.cookie = "newtoken ="
      history.push("/login")
    } else {
      alert("Algo falló y no cerró sesión")
    }
  }

  const [scrollDown, setScrollDown] = useState(false)

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY>100) setScrollDown(true)
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

            {user && user.role===1 &&
              <>
              <Nav.Link href="/estadisticas" style={{color:'#fbfbfb', margin: window.screen.width<989 ? '8px 0' : '0'}}>
                &nbsp; &nbsp;Estadísticas&nbsp; &nbsp;
              </Nav.Link>
              <Nav.Link href="/admins" style={{color:'#fbfbfb'}}>&nbsp; &nbsp;Administradores&nbsp; &nbsp;</Nav.Link>
              </>
            }
          </Nav>

          {user && user.isAuth &&
            <>
            <Nav.Link href="/user" style={{display:'flex', alignItems:'center', marginBottom: window.screen.width<992 ? '12px' : '0'}}>
              <span style={{display: mobile ? 'none' : 'block'}}>
                <FaUserAlt size="17px" color="lightgray" />
                &nbsp;&nbsp;
              </span>
              
              <span style={{color:'#fbfbfb'}}> Mi Usuario </span> &nbsp;
            </Nav.Link>

            <Nav>
              <Form inline>
                <Button variant="outline-info" style={{color:'#fbfbfb', borderColor:'#fbfbfb'}} onClick={()=>logoutHandle()}>CERRAR SESIÓN</Button>
              </Form>
            </Nav>
            </>
          }

        </Navbar.Collapse>
      </Navbar>
      

      {user && user.isAuth &&
        ((mobile && !scrollDown) || !mobile) ?
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


export default NavBar
