import { Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useDispatch, useSelector } from 'react-redux'
import { NavBar } from './commons/NavBar'
import { Footer } from './commons/Footer'
import { AlertModal } from './commons/AlertModal'
import { DarkModeButton } from './commons/DarkModeButton'
import { FloatingWidgets } from './commons/FloatingWidgets'
import { LoginPage } from './LoginPage'
import { HomePage } from './HomePage'
import { IndexPage } from './IndexPage'
import { TelephonicPage } from './TelephonicPage'
import { StatisticsPage } from './StatisticsPage'
import { LocalStatisticsPage } from './LocalStatisticsPage'
import { UserPage } from './UserPage'
import { AdminsPage } from './AdminsPage'
import { RecoveryPage } from './RecoveryPage'
import { HouseToHousePage } from './HouseToHousePage'
import { LogsPage } from './LogsPage'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'
import { TermsOfServicePage } from './TermsOfService'
import { CampaignPage } from './campaigns/CampaignPage'
import { CampaignAdminsPage } from './campaigns/CampaignAdminsPage'
import { GmailTokensPage } from './GmailTokensPage'
import { changeMobileModeReducer } from '../store/MobileModeSlice'
import { AuthProvider } from '../context/authContext'
import { recaptchaPublicKey } from '../config'
import { typeAppDispatch, typeRootState } from '../models'
import 'bootstrap/dist/css/bootstrap.min.css'

export const App = () => {

    const { isDarkMode, isMobile, showingAlertModal } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        showingAlertModal: state.alertModal.showingAlertModal
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()

    useEffect(() => {
        window.addEventListener('resize', (event: any) => {
            const width: number = event.target.screen.width
            if ((isMobile && width >= 990) || (!isMobile && width < 990)) {
                dispatch(changeMobileModeReducer({ isMobile: width < 990 }))
            }
        })
    }, [isMobile, dispatch])

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>
                <AuthProvider>
                    
                    <div style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>

                        <div style={{ position: 'fixed', width: '100%', zIndex: 4 }}>
                            <NavBar />
                            <FloatingWidgets />
                        </div>


                        <div style={{
                            maxWidth: isMobile ? '95%' : '90%',
                            paddingTop: '75px',
                            margin: 'auto',
                            minHeight: 'calc(100vh - 80px)'
                        }}>
                            <Routes>
                                {/* Public */}
                                <Route path={'/'} element={ <HomePage /> } />
                                <Route path={'/celulares/:id'} element={ <CampaignPage /> } />
                                <Route path={'/privacidad'} element={ <PrivacyPolicyPage /> } />
                                <Route path={'/recovery/:id'} element={ <RecoveryPage /> } />
                                <Route path={'/servicio'} element={ <TermsOfServicePage /> } />
                                {/* Strict Public */}
                                <Route path={'/acceso'} element={ <LoginPage /> } />
                                {/* Private */}
                                <Route path={'/index'} element={ <IndexPage /> } />
                                <Route path={'/territorios/:territorio/:manzana'} element={ <TelephonicPage /> } />
                                <Route path={'/territorios/:territorio/:manzana/:todo'} element={ <TelephonicPage /> } />
                                <Route path={'/usuario'} element={ <UserPage /> } />
                                {/* Private Admins */}
                                <Route path={'/admins'} element={ <AdminsPage /> } />
                                <Route path={'/celulares-admins'} element={ <CampaignAdminsPage /> } />
                                <Route path={'/gmail'} element={ <GmailTokensPage /> } />
                                <Route path={'/casa-en-casa/:territory'} element={ <HouseToHousePage /> } />
                                <Route path={'/estadisticas/:territorio'} element={ <LocalStatisticsPage /> } />
                                <Route path={'/logs'} element={ <LogsPage /> } />
                                <Route path={'/estadisticas'} element={ <StatisticsPage /> } />
                                {/* * */}
                                <Route path={'*'} element={ <HomePage /> } />
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
