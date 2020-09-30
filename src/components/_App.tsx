import React, { Suspense } from 'react';
import './css/App.css';
import { Route, Switch } from 'react-router-dom';
import Auth from '../hoc/auth';
import LoginPage from './LoginPage';
import RegisterPage from "./RegisterPage";
import HomePage from "./HomePage";
import IndexPage from "./IndexPage"
import TerritoriosPage from "./TerritoriosPage";
import EstadisticasPage from "./EstadisticasPage";
import UserPage from "./UserPage";
import AdminsPage from "./AdminsPage";
import RoomsPage from "./RoomsPage";
import NavBar from './_NavBar';
import Footer from './_Footer'
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {

  return (
    <Suspense fallback={(<div> Cargando... </div>)}>
      <NavBar />
      <div style={{maxWidth:'90%', paddingTop:'75px', margin:'auto', minHeight:'calc(100vh - 80px)'}}>
        <Switch>
          {/* <Redirect exact strict from="/" to="/login" /> */}
          <Route exact path="/" component={Auth(HomePage, false)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/index" component={Auth(IndexPage, true)} />
          <Route exact path="/territorios/:territorio" component={Auth(TerritoriosPage, true)} />
          <Route exact path="/estadisticas" component={Auth(EstadisticasPage, true, true)} />
          <Route exact path="/user" component={Auth(UserPage, true)} />
          <Route exact path="/admins" component={Auth(AdminsPage, true, true)} />
          <Route exact path="/salas" component={Auth(RoomsPage, true)} />
          <Route path="/" component={Auth(LoginPage, false)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  )
}

export default App
