import React, { Suspense, useEffect, useState } from 'react'
import './css/App.css'
import { Route, Switch, Redirect } from 'react-router-dom'
import Auth from '../hoc/auth'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import HomePage from './HomePage'
import IndexPage from './IndexPage'
import TerritoriosPage from './TerritoriosPage'
import EstadisticasPage from './EstadisticasPage'
import EstadisticasLocalPage from './EstadisticasLocalPage'
import UserPage from './UserPage'
import AdminsPage from './AdminsPage'
import CelularesPage from './CelularesPage'
import CelularesPage2 from './CelularesPage2'
import NavBar from './_NavBar'
import Footer from './_Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { SERVER } from '../config'
import { split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { isLocalhost } from '../hoc/functions'


export let mobile = window.screen.width<990 ? true : false

const httpLink = new HttpLink({
  uri: `${SERVER}/api/graphql/`
})

const secure = isLocalhost ? '' : 's'

const wsLink = new WebSocketLink({
  uri: `ws${secure}://${SERVER.split('//')[1]}/graphql`,
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

  const [user, setUser] = useState({darkMode:false})
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('darkMode')==='true') setDarkMode(true)

    ;(async () => {
      const fetchy = await fetch(`${SERVER}/api/users/auth`, {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Accept':'application/json'},
        body: JSON.stringify({token:localStorage.getItem('token')})
      })
      setUser(await fetchy.json())
      console.log(user)
    })()

  }, [])

  const changeDarkMode = () => {
    if (darkMode) localStorage.setItem('darkMode', 'false')
    else localStorage.setItem('darkMode', 'true')
    setDarkMode(!darkMode)

    ;(async () => {
      const fetchy = await fetch(`${SERVER}/api/users/change-mode`, {
        method: 'POST',
        headers: {'Content-Type': 'Application/json'},
        body: JSON.stringify({token:localStorage.getItem('token'), darkMode:!user.darkMode})
      })
      const resp = await fetchy.json()
      if (resp.success) {
          console.log("resp:", resp)
          // if (resp.darkMode) {localStorage.setItem('darkMode', 'true'); setDarkMode(true)}
          // else {localStorage.setItem('darkMode', 'false'); setDarkMode(false)}
          window.location.reload()
      }
      else console.log("Error cambiando el mode")
    })()
  }
  

  return (

    <Suspense fallback={(<div> Cargando... </div>)}>

      <GoogleReCaptchaProvider reCaptchaKey="6LfDIdIZAAAAAElWChHQZq-bZzO9Pu42dt9KANY9">
      <ApolloProvider client={client}>

        <div style={darkMode ? {backgroundColor:'black'} : {backgroundColor:'white'}}>

          <NavBar />

          <div style={{
            maxWidth: mobile ? '95%' : '90%',
            paddingTop: '75px',
            margin: 'auto',
            minHeight: 'calc(100vh - 80px)'
          }}>

            <Switch>
              {/* <Redirect exact strict from="/" to="/login" /> */}
              <Redirect exact from='/' to="/login" />
              {/* <Route exact path="/" component={Auth(HomePage, false)} /> */}
              <Route exact path="/login" component={Auth(LoginPage, false)} />
              <Route exact path="/register" component={Auth(RegisterPage, false)} />
              <Route exact path="/index" component={Auth(IndexPage, true)} />
              <Route exact path="/territorios/:territorio/:manzana" component={Auth(TerritoriosPage, true)} />
              <Route exact path="/territorios/:territorio/:manzana/:todo" component={Auth(TerritoriosPage, true)} />
              <Route exact path="/estadisticas" component={Auth(EstadisticasPage, true, true)} />
              <Route exact path="/estadisticas/:territorio" component={Auth(EstadisticasLocalPage, true, true)} />
              <Route exact path="/user" component={Auth(UserPage, true)} />
              <Route exact path="/admins" component={Auth(AdminsPage, true, true)} />
              <Route exact path="/celulares2021" component={Auth(CelularesPage, true, true)} />
              <Route exact path="/celulares/:id" component={Auth(CelularesPage2, true, false)} />
              <Route path="/" component={Auth(LoginPage, false)} />
            </Switch>

            <div className='custom-control custom-switch' style={{position:'fixed', bottom:'20px'}}>
              <input type='checkbox' className='custom-control-input' id='customSwitches' checked={darkMode} onChange={() => changeDarkMode()} />
              <label className='custom-control-label' htmlFor='customSwitches' style={{color:'red'}}> {mobile ? '' : 'Modo Oscuro'} </label>
            </div>
            
          </div>

          <Footer />

        </div>

      </ApolloProvider>
      </GoogleReCaptchaProvider>
      
    </Suspense>
  )
}

export default App
