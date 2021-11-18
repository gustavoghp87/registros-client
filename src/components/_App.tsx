import { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
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
    const [done, setDone] = useState<boolean>(false)

    useEffect(() => {
        if (done) return
        (async () => {
            const user: typeUser|null = await authUserService()
            if (user && user.darkMode !== undefined) {
                if (darkMode !== user.darkMode) setDarkMode(user.darkMode)
                if (getDarkModeStorage() !== user.darkMode.toString()) setDarkModeStorage(user.darkMode)
                setDone(true)
            }
        })()
    }, [done, darkMode])

    const changeDarkMode = async () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        setDarkModeStorage(newMode)
        const success: boolean = await changeDarkModeService(newMode)
        if (!success) alert("Algo falló al guardar el cambio de modo")
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

                        <Routes>
                            <Route path="/" element={ <HomePage /> } />
                            <Route path="/login" element={ <LoginPage /> } />
                            <Route path="/register" element={ <RegisterPage /> } />
                            <Route path="/index" element={ <IndexPage /> } />
                            <Route path="/territorios/:territorio/:manzana" element={ <TerritoriosPage /> } />
                            <Route path="/territorios/:territorio/:manzana/:todo" element={ <TerritoriosPage /> } />
                            <Route path="/estadisticas" element={ <EstadisticasPage /> } />
                            <Route path="/estadisticas/:territorio" element={ <EstadisticasLocalPage /> } />
                            <Route path="/user" element={ <UserPage /> } />
                            <Route path="/admins" element={ <AdminsPage /> } />
                            <Route path="*" element={ <HomePage /> } />
                        </Routes>

                        <div className='custom-control custom-switch' style={{ position: 'fixed', bottom: '20px' }}>
                            <input className='custom-control-input'
                                type='checkbox'
                                id='customSwitches'
                                checked={darkMode}
                                onChange={() => changeDarkMode()}
                            />
                            <label className='custom-control-label' htmlFor='customSwitches' style={{ color: darkMode ? 'white' : 'red' }}>
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
