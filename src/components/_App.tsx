import React, { Suspense } from 'react'
import './css/App.css'
import { Route, Switch } from 'react-router-dom'
import Auth from '../hoc/auth'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import HomePage from './HomePage'
import IndexPage from './IndexPage'
import TerritoriosPage from './TerritoriosPage'
import EstadisticasPage from './EstadisticasPage'
import UserPage from './UserPage'
import AdminsPage from './AdminsPage'
import RoomsPage from './RoomsPage'
import NavBar from './_NavBar'
import Footer from './_Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { SERVER } from '../config.json'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'


export let mobile = window.screen.width<990 ? true : false

const httpLink = new HttpLink({
  uri: `${SERVER}/api/graphql/`
})

const wsLink = new WebSocketLink({
  uri: `wss://${SERVER.split('//')[1]}/graphql`,
  options: {reconnect:true}
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  }, wsLink, httpLink
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})

function App() {

  return (

    <Suspense fallback={(<div> Cargando... </div>)}>

      <GoogleReCaptchaProvider reCaptchaKey="6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9">
      <ApolloProvider client={client}>

        <NavBar />

        <div style={{
          maxWidth: mobile ? '95%' : '90%',
          paddingTop:'75px',
          margin:'auto',
          minHeight:'calc(100vh - 80px)'
        }}>

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

      </ApolloProvider>
      </GoogleReCaptchaProvider>
      
    </Suspense>
  )
}

export default App
