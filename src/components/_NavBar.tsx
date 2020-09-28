import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { SERVER } from '../config.json';
import { useSelector } from 'react-redux';


function NavBar() {

  console.log("document.cookie desde navbar:", document.cookie);

  const user = useSelector((state:any) => state.user.userData);

  const history = useHistory()

  const logoutHandle = async () => {
    const axios = await Axios.post(`${SERVER}/api/users/logout`, {token:document.cookie});
    const response = axios.data.response;
    if (response==="ok") {
      alert("Sesión de usuario cerrada con éxito");
      history.push("/login");
    } else {
      alert("Algo falló y no cerró sesión");
    };
  };

  const showTerritorios = () => {
    try {
      if (user.userData.isAuth) 
        return (<Nav.Link href="/index">&nbsp; &nbsp;Territorios&nbsp; &nbsp;</Nav.Link>);
      else
        return (<Nav.Link href="/login">&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>)
    } catch {
      return (<Nav.Link href="/login">&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>)
    };
  };

  const showAdmins = () => {
    try {
      if (user.userData.role===1)
        return (
          <>
            <Nav.Link href="/estadisticas">&nbsp; &nbsp;Estadísticas&nbsp; &nbsp;</Nav.Link>
            <Nav.Link href="/admins">&nbsp; &nbsp;Administradores&nbsp; &nbsp;</Nav.Link>
          </>
        );
    } catch {};
  };
  
  const showCerrarSesion = () => {
    try {
      if (user.userData.isAuth)
        return (
          <>
            <NavDropdown title="&nbsp; &nbsp;Mi usuario&nbsp; &nbsp;" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Datos</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Actividad</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Otros</NavDropdown.Item>
            </NavDropdown>
            <Nav>
              <Form inline>
                {/* <FormControl type="text" placeholder="Buscar..." className="mr-sm-2" /> */}
                <Button variant="outline-info" onClick={()=>logoutHandle()}>CERRAR SESIÓN</Button>
              </Form>
            </Nav>
          </>
        );
    } catch {};
  };


  return (
    <div>
      <Navbar bg="dark" variant="dark" collapseOnSelect expand="lg">
        <Navbar.Brand href="/">&nbsp; INICIO</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="mr-auto">
            {showTerritorios()}
            {showAdmins()}
          </Nav>

          {showCerrarSesion()}

        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};


export default NavBar;
