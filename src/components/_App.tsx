import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../store/store'
import { NavBar } from './commons/NavBar'
import { Footer } from './commons/Footer'
import { AlertModal } from './commons/AlertModal'
import { DarkModeButton } from './commons/DarkModeButton'
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
import { changeMobileModeReducer } from '../store/MobileMode.Slice'
import { AuthProvider } from '../context/authContext'
import { recaptchaPublicKey } from '../config'
import './css/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export const generalBlue: string = "#4a6da7"

export const App = () => {

    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const { showingAlertModal } = useSelector((state: typeRootState) => state.alertModal)
    const dispatch: typeAppDispatch = useDispatch()
    setTimeout(() => {
        if (isMobile && window.screen.width >= 990)
            dispatch(changeMobileModeReducer({ isMobile: window.screen.width < 990 }))
        else if (!isMobile && window.screen.width < 990)
            dispatch(changeMobileModeReducer({ isMobile: window.screen.width < 990 }))
    }, 300)

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <AuthProvider>
                    
                    <div style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>

                        <NavBar />

                        <div style={{
                            maxWidth: isMobile ? '95%' : '90%',
                            paddingTop: '75px',
                            margin: 'auto',
                            minHeight: 'calc(100vh - 80px)'
                        }}>
                            <Routes>
                                <Route element={ <HomePage /> } path={"/"} />
                                <Route element={ <LoginPage /> } path={"/login"} />
                                <Route element={ <RegisterPage /> } path={"/registro"} />
                                <Route element={ <IndexPage /> } path={"/index"} />
                                <Route element={ <CasaEnCasaPage /> } path={"/casa-en-casa/:territory"} />
                                <Route element={ <TerritoriosPage /> } path={"/territorios/:territorio/:manzana"} />
                                <Route element={ <TerritoriosPage /> } path={"/territorios/:territorio/:manzana/:todo"} />
                                <Route element={ <EstadisticasPage /> } path={"/estadisticas"} />
                                <Route element={ <EstadisticasLocalPage /> } path={"/estadisticas/:territorio"} />
                                <Route element={ <UserPage /> } path={"/usuario"} />
                                <Route element={ <AdminsPage /> } path={"/admins"} />
                                <Route element={ <RecoveryPage /> } path={"/recovery/:id"} />
                                <Route element={ <CampaignPage /> } path={"/celulares/:id"} />
                                <Route element={ <CampaignAdminsPage /> } path={"/celulares-admins"} />
                                <Route element={ <LogsPage /> } path={"/logs"} />
                                <Route element={ <HomePage /> } path={"*"} />
                            </Routes>

                            <DarkModeButton />

                            {showingAlertModal && <AlertModal />}
                            
                        </div>

                        <Footer />

                    </div>
                </AuthProvider>
            </GoogleReCaptchaProvider>
        </Suspense>
    )
}
