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
import { CampaignPage } from './campaigns/CampaignPage'
import { CampaignAdminsPage } from './campaigns/CampaignAdminsPage'
import { BgColorButton } from './commons/BgColorButton'
import { AuthProvider } from '../context/authContext'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { getDarkModeLocalStorage, isMobile, setDarkModeLocalStorage } from '../services/functions'
import { recaptchaPublicKey } from '../config'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'


export const App = () => {

    const [darkMode, setDarkMode] = useState<boolean>(getDarkModeLocalStorage())
    //const user: typeUser|undefined = useAuth().user
    
    // useEffect(() => {
    //     if (user && user.isAuth) return
    //     if (user && typeof user.darkMode === 'boolean') {
    //         if (darkMode !== user.darkMode) setDarkMode(user.darkMode)
    //         if (getDarkModeStorage() !== user.darkMode.toString()) setDarkModeStorage(user.darkMode)
    //     }
    // }, [user, darkMode])

    const changeDarkMode = async (): Promise<void> => {
        const newMode: boolean = !darkMode
        setDarkMode(newMode)
        setDarkModeLocalStorage(newMode)
    //     const success: boolean = await changeDarkModeService(newMode)
    //     if (!success) alert("Algo falló al guardar el cambio de modo")
    }

    const secondaryColor: string = darkMode ? '#343a40' : ''

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <AuthProvider>
                    
                    <div style={{ backgroundColor: darkMode ? 'black' : 'white' }}>

                        <NavBar secondaryColor={secondaryColor} />

                        <div style={{
                            maxWidth: isMobile ? '95%' : '90%',
                            paddingTop: '75px',
                            margin: 'auto',
                            minHeight: 'calc(100vh - 80px)'
                        }}>

                            <Routes>
                                <Route element={ <HomePage /> } path={"/"} />
                                <Route element={ <LoginPage /> } path={"/login"} />
                                <Route element={ <RegisterPage /> } path={"/register"} />
                                <Route element={ <IndexPage secondaryColor={secondaryColor} /> } path={"/index"} />
                                <Route element={ <CasaEnCasaPage /> } path={"/casaencasa/:territory"} />
                                <Route element={ <TerritoriosPage secondaryColor={secondaryColor} /> } path={"/territorios/:territorio/:manzana"} />
                                <Route element={ <TerritoriosPage secondaryColor={secondaryColor} /> } path={"/territorios/:territorio/:manzana/:todo"} />
                                <Route element={ <EstadisticasPage secondaryColor={secondaryColor} /> } path={"/estadisticas"} />
                                <Route element={ <EstadisticasLocalPage secondaryColor={secondaryColor} /> } path={"/estadisticas/:territorio"} />
                                <Route element={ <UserPage secondaryColor={secondaryColor} /> } path={"/user"} />
                                <Route element={ <AdminsPage secondaryColor={secondaryColor} /> } path={"/admins"} />
                                <Route element={ <RecoveryPage /> } path={"/recovery/:id"} />
                                <Route element={ <CampaignPage /> } path={"/celulares/:id"} />
                                <Route element={ <CampaignAdminsPage /> } path={"/celulares-admins"} />
                                <Route element={ <HomePage /> } path={"*"} />
                            </Routes>

                            <BgColorButton darkMode={darkMode} changeDarkMode={changeDarkMode} />
                            
                        </div>

                        <Footer />

                    </div>
                </AuthProvider>
            </GoogleReCaptchaProvider>
        </Suspense>
    )
}
