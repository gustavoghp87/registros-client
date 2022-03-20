import { Suspense, useState } from 'react'
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
import { LogsPage } from './LogsPage'
import { CampaignPage } from './campaigns/CampaignPage'
import { CampaignAdminsPage } from './campaigns/CampaignAdminsPage'
import { BgColorButton } from './commons/BgColorButton'
import { AuthProvider } from '../context/authContext'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { isMobile } from '../services/functions'
import { getDarkModeService, setDarkModeService } from '../services/userServices'
import { recaptchaPublicKey } from '../config'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export const generalBlue: string = "#4a6da7"

export const App = () => {

    const [isDarkMode, setIsDarkMode] = useState<boolean>(getDarkModeService())
    //const user: typeUser|undefined = useAuth().user
    
    // useEffect(() => {
    //     if (user && user.isAuth) return
    //     if (user && typeof user.darkMode === 'boolean') {
    //         if (darkMode !== user.darkMode) setDarkMode(user.darkMode)
    //         if (getDarkModeStorage() !== user.darkMode.toString()) setDarkModeStorage(user.darkMode)
    //     }
    // }, [user, darkMode])

    const changeDarkMode = async (): Promise<void> => {
        const newMode: boolean = !isDarkMode
        setIsDarkMode(newMode)
        setDarkModeService(newMode)
    //     const success: boolean = await changeDarkModeService(newMode)
    //     if (!success) alert("Algo falló al guardar el cambio de modo")
    }

    //const secondaryColor: string = darkMode ? '#343a40' : ''

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <AuthProvider>
                    
                    <div style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>

                        <NavBar isDarkMode={isDarkMode} />

                        <div style={{
                            maxWidth: isMobile ? '95%' : '90%',
                            paddingTop: '75px',
                            margin: 'auto',
                            minHeight: 'calc(100vh - 80px)'
                        }}>

                            <Routes>
                                <Route element={ <HomePage isDarkMode={isDarkMode} /> } path={"/"} />
                                <Route element={ <LoginPage isDarkMode={isDarkMode} /> } path={"/login"} />
                                <Route element={ <RegisterPage isDarkMode={isDarkMode} /> } path={"/register"} />
                                <Route element={ <IndexPage isDarkMode={isDarkMode} /> } path={"/index"} />
                                <Route element={ <CasaEnCasaPage isDarkMode={isDarkMode} /> } path={"/casaencasa/:territory"} />
                                <Route element={ <TerritoriosPage isDarkMode={isDarkMode} /> } path={"/territorios/:territorio/:manzana"} />
                                <Route element={ <TerritoriosPage isDarkMode={isDarkMode} /> } path={"/territorios/:territorio/:manzana/:todo"} />
                                <Route element={ <EstadisticasPage isDarkMode={isDarkMode} /> } path={"/estadisticas"} />
                                <Route element={ <EstadisticasLocalPage isDarkMode={isDarkMode} /> } path={"/estadisticas/:territorio"} />
                                <Route element={ <UserPage isDarkMode={isDarkMode} /> } path={"/usuario"} />
                                <Route element={ <AdminsPage isDarkMode={isDarkMode} /> } path={"/admins"} />
                                <Route element={ <RecoveryPage isDarkMode={isDarkMode} /> } path={"/recovery/:id"} />
                                <Route element={ <CampaignPage isDarkMode={isDarkMode} /> } path={"/celulares/:id"} />
                                <Route element={ <CampaignAdminsPage isDarkMode={isDarkMode} /> } path={"/celulares-admins"} />
                                <Route element={ <LogsPage isDarkMode={isDarkMode} /> } path={"/logs"} />
                                <Route element={ <HomePage isDarkMode={isDarkMode} /> } path={"*"} />
                            </Routes>

                            <BgColorButton darkMode={isDarkMode} changeDarkMode={changeDarkMode} />
                            
                        </div>

                        <Footer />

                    </div>
                </AuthProvider>
            </GoogleReCaptchaProvider>
        </Suspense>
    )
}
