import React from 'react';
import { Navbar, Nav, NavDropdown, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { SERVER } from '../config.json';
import { useSelector } from 'react-redux';
import { IUser, IState } from '../types/types';
import { FaUserAlt } from 'react-icons/fa';


function NavBar() {

  console.log("document.cookie desde navbar:", document.cookie);

  const user:IUser = useSelector((state:IState) => state.user.userData);

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
      if (user.isAuth) 
        return (<Nav.Link href="/index">&nbsp; &nbsp;Territorios&nbsp; &nbsp;</Nav.Link>);
      else
        return (<Nav.Link href="/login">&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>)
    } catch {
      return (<Nav.Link href="/login">&nbsp; &nbsp;Entrar&nbsp; &nbsp;</Nav.Link>)
    };
  };

  const showAdmins = () => {
    try {
      if (user.role===1)
        return (
          <>
            <Nav.Link href="/estadisticas">&nbsp; &nbsp;Estadísticas&nbsp; &nbsp;</Nav.Link>
            {window.screen.width<989 ? "<br/>" : ""}
            {window.screen.width<989 ? "<br/>" : ""}
            {window.screen.width<989 ? "<br/>" : ""}
            <Nav.Link href="/admins">&nbsp; &nbsp;Administradores&nbsp; &nbsp;</Nav.Link>
          </>
        );
    } catch {};
  };
  
  const showCerrarSesion = () => {
    try {
      if (user.isAuth)
        return (
          <>
          
            <Nav.Link href="/user" style={{display:'flex', alignItems:'center', marginBottom: window.screen.width<992 ? '12px' : '0'}}>
              <FaUserAlt size="17px" color="gray" />
              &nbsp; Mi Usuario &nbsp;
            </Nav.Link>

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
    <div style={{position:'fixed', width:'100%', zIndex:2}}>
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
      
      {user && user.isAuth &&
        <div style={{position:'fixed', right:'0', marginRight:'18px', marginTop:'5px', zIndex:1}}>
          <p style={{textAlign:'right', marginBottom:'0'}}> {user.email} </p>
          <p style={{textAlign:'right', marginBottom:'0'}}> Grupo: {user.group} </p>
          <p style={{textAlign:'right'}}> {user.role ? "Administrador" : ""} </p>
        </div>
      }

    </div>
  );
};


export default NavBar;
