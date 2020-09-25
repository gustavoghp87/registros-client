import React, { Suspense } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';

import LoginPage from './LoginPage';
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import TerritoriosPage from "./TerritoriosPage";
import EstadisticasPage from "./EstadisticasPage";
import UserPage from "./UserPage";
import AdminsPage from "./AdminsPage";
import RoomsPage from "./RoomsPage";

import NavBar from './_NavBar';
import Footer from './_Footer';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <Suspense fallback={(<div>Cargando...</div>)}>
      <NavBar />
      <div style={{maxWidth:'90%', paddingTop:'75px', margin:'auto', minHeight:'calc(100vh - 80px)'}}>
        <Switch>
          {/* <Redirect exact strict from="/" to="/login" /> */}
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/territorios" component={HomePage} />
          <Route exact path="/territorios/:territorio" component={TerritoriosPage} />
          <Route exact path="/estadisticas" component={EstadisticasPage} />
          <Route exact path="/user" component={UserPage} />
          <Route exact path="/admins" component={AdminsPage} />
          <Route exact path="/salas" component={RoomsPage} />
          <Route path="/" component={LoginPage} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
};

export default App;
