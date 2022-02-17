import { Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { NavBar } from './commons/NavBar'
import { Footer } from './commons/Footer'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { HomePage } from './HomePage'
import { IndexPage } from './IndexPage'
import { TerritoriosPage } from './TerritoriosPage'
import { EstadisticasPage } from './EstadisticasPage'
import { EstadisticasLocalPage } from './EstadisticasLocalPage'
import { UserPage } from './UserPage'
import { AdminsPage } from './AdminsPage'
import { RecoveryPage } from './RecoveryPage'
import { CasaEnCasaPage } from './CasaEnCasaPage'
import { BgColorButton } from './commons/BgColorButton'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { authUserService, changeDarkModeService } from '../services/userServices'
import { isMobile } from '../services/functions'
import { recaptchaPublicKey } from '../config'
import { typeUser } from '../models/typesUsuarios'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export const App = () => {

    const [user, setUser] = useState<typeUser>()
    const getDarkModeStorage = () => localStorage.getItem('darkMode')
    const mode: boolean = getDarkModeStorage() === 'true'
    const [darkMode, setDarkMode] = useState<boolean>(mode)
    
    const setDarkModeStorage = (darkMode: boolean) => {
        if (darkMode !== null && darkMode !== undefined) localStorage.setItem('darkMode', darkMode.toString())
    }
    
    useEffect(() => {
        if (user && user.isAuth) return
        authUserService().then((user0: typeUser|null) => {
            if (user0) setUser(user0)
            if (user0 && typeof user0.darkMode === 'boolean') {
                if (darkMode !== user0.darkMode) setDarkMode(user0.darkMode)
                if (getDarkModeStorage() !== user0.darkMode.toString()) setDarkModeStorage(user0.darkMode)
            }
        })
    }, [user, darkMode])

    const changeDarkMode = async (): Promise<void> => {
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

                    <NavBar user={user} />

                    <div style={{
                        maxWidth: isMobile ? '95%' : '90%',
                        paddingTop: '75px',
                        margin: 'auto',
                        minHeight: 'calc(100vh - 80px)'
                    }}>

                        <Routes>
                            <Route path={"/"} element={ <HomePage user={user} /> } />
                            <Route path={"/login"} element={ <LoginPage user={user} /> } />
                            <Route path={"/register"} element={ <RegisterPage user={user} /> } />
                            <Route path={"/index"} element={ <IndexPage user={user} /> } />
                            <Route path={"/casaencasa/:territory"} element={ <CasaEnCasaPage user={user} /> } />
                            <Route path={"/territorios/:territorio/:manzana"} element={ <TerritoriosPage user={user} /> } />
                            <Route path={"/territorios/:territorio/:manzana/:todo"} element={ <TerritoriosPage user={user} /> } />
                            <Route path={"/estadisticas"} element={ <EstadisticasPage /> } />
                            <Route path={"/estadisticas/:territorio"} element={ <EstadisticasLocalPage /> } />
                            <Route path={"/user"} element={ <UserPage user={user} /> } />
                            <Route path={"/admins"} element={ <AdminsPage /> } />
                            <Route path={"/recovery/:id"} element={ <RecoveryPage /> } />
                            <Route path={"*"} element={ <HomePage user={user} /> } />
                        </Routes>

                        <BgColorButton darkMode={darkMode} changeDarkMode={changeDarkMode} />
                        
                    </div>

                    <Footer />

                </div>
            </GoogleReCaptchaProvider>
        </Suspense>
    )
}
