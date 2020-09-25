import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { SERVER } from '../config.json';

function NavBar() {

  const history = useHistory()

  const logoutHandle = async () => {
    const axios = await Axios(`${SERVER}/api/users/logout`);
    const response = axios.data.response;
    if (response==="ok") {      
      alert("Sesión de usuario cerrada con éxito");
      history.push("/login");
    } else {
      alert("Algo falló y no cerró sesión");
    }
  };


  return (

    <div>
      <Navbar bg="dark" variant="dark" collapseOnSelect expand="lg">
        <Navbar.Brand href="/">&nbsp; INICIO</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          
            <Nav.Link href="/territorios">&nbsp; &nbsp;Territorios&nbsp; &nbsp;</Nav.Link>
            <Nav.Link href="/salas">&nbsp; &nbsp;Salas&nbsp; &nbsp;</Nav.Link>
            <Nav.Link href="/estadisticas">&nbsp; &nbsp;Estadísticas&nbsp; &nbsp;</Nav.Link>
            <Nav.Link href="/admins">&nbsp; &nbsp;Administradores&nbsp; &nbsp;</Nav.Link>

            <NavDropdown title="&nbsp; &nbsp;Mi usuario&nbsp; &nbsp;" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Datos</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Actividad</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Otros</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav>
            <Form inline>
              {/* <FormControl type="text" placeholder="Buscar..." className="mr-sm-2" /> */}
              <Button variant="outline-info" onClick={()=>logoutHandle()}>CERRAR SESIÓN</Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}


export default NavBar