import { Suspense, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Auth } from '../hoc/auth'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { HomePage } from './HomePage'
import { IndexPage } from './IndexPage'
import { TerritoriosPage } from './TerritoriosPage'
import { EstadisticasPage } from './EstadisticasPage'
import { EstadisticasLocalPage } from './EstadisticasLocalPage'
import { UserPage } from './UserPage'
import { AdminsPage } from './AdminsPage'
import { NavBar } from './_NavBar'
import { Footer } from './_Footer'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { authUserService, changeDarkModeService } from '../services/userServices'
import { isMobile } from '../services/functions'
import { recaptchaPublicKey } from '../config'
import { typeUser } from '../models/typesUsuarios'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

    export const App = () => {

    const getDarkModeStorage = () => localStorage.getItem('darkMode')
    const setDarkModeStorage = (darkMode: boolean) => localStorage.setItem('darkMode', darkMode.toString())
    const mode: boolean = getDarkModeStorage() === 'true'
    const [darkMode, setDarkMode] = useState<boolean>(mode)

    useEffect(() => {
        ;(async () => {
            updateDarkMode()
        })()
    }, [])

    const updateDarkMode = async () => {
        const user: typeUser|null = await authUserService()
        if (user && user.darkMode !== undefined) {
            if (darkMode !== user.darkMode) setDarkMode(user.darkMode)
            if (getDarkModeStorage() !== user.darkMode.toString()) setDarkModeStorage(user.darkMode)
        }
    }

    const changeDarkMode = async () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        setDarkModeStorage(newMode)
        changeDarkModeService(newMode)
    }
    

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <div style={ darkMode ? { backgroundColor: 'black' } : { backgroundColor: 'white' } }>

                    <NavBar />

                    <div style={{
                        maxWidth: isMobile ? '95%' : '90%',
                        paddingTop: '75px',
                        margin: 'auto',
                        minHeight: 'calc(100vh - 80px)'
                    }}>

                        <Switch>
                        {/* <Redirect exact strict from="/" to="/login" /> */}
                        {/* <Redirect exact from='/' to="/login" /> */}
                        <Route exact path="/" component={ HomePage } />
                        <Route exact path="/login" component={ LoginPage } />
                        <Route exact path="/register" component={ RegisterPage } />
                        <Route exact path="/index" component={ Auth(IndexPage, true) } />
                        <Route exact path="/territorios/:territorio/:manzana" component={ Auth(TerritoriosPage, true) } />
                        <Route exact path="/territorios/:territorio/:manzana/:todo" component={ Auth(TerritoriosPage, true) } />
                        <Route exact path="/estadisticas" component={ Auth(EstadisticasPage, true, true) } />
                        <Route exact path="/estadisticas/:territorio" component={ Auth(EstadisticasLocalPage, true, true) } />
                        <Route exact path="/user" component={ Auth(UserPage, true) } />
                        <Route exact path="/admins" component={ Auth(AdminsPage, true, true) } />
                        <Route path="/" component={ HomePage } />
                        </Switch>

                        <div className='custom-control custom-switch' style={{position:'fixed', bottom:'20px'}}>
                        <input className='custom-control-input'
                            type='checkbox'
                            id='customSwitches'
                            checked={darkMode}
                            onChange={() => changeDarkMode()}
                        />
                        <label className='custom-control-label' htmlFor='customSwitches' style={{color: darkMode ? 'white' : 'red'}}>
                            <b> {isMobile ? '' : (darkMode ? 'Modo Claro' : 'Modo Oscuro')} </b>
                        </label>
                        </div>
                        
                    </div>

                    <Footer />

                </div>
            </GoogleReCaptchaProvider>
        </Suspense>
    )
}
