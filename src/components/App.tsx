import { Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useDispatch, useSelector } from 'react-redux'
import * as Pages from './pages'
import { AlertModal, DarkModeButton, FloatingWidgets, Footer, NavBar } from './commons'
import { recaptchaPublicKey } from '../config'
import { changeMobileModeReducer } from '../store/MobileModeSlice'
import { typeAppDispatch, typeRootState, typeUser } from '../models'
import { useAuth } from '../context/authContext'

export const App = () => {
    
    const user: typeUser|undefined = useAuth().user
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
                dispatch(changeMobileModeReducer({ isMobile: width < 990}))
            }
        })
    }, [dispatch, isMobile])

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>
            <GoogleReCaptchaProvider reCaptchaKey={recaptchaPublicKey}>

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
                            <Route path={'/'} element={ <Pages.HomePage /> } />
                            <Route path={'/celulares/:id'} element={ <Pages.CampaignPage /> } />
                            <Route path={'/privacidad'} element={ <Pages.PrivacyPolicyPage /> } />
                            <Route path={'/recovery/:id'} element={ <Pages.RecoveryPage /> } />
                            <Route path={'/servicio'} element={ <Pages.TermsOfServicePage /> } />
                            {/* Strict Public */}
                            <Route path={'/acceso'} element={ <Pages.LoginPage /> } />
                            {/* Private */}
                            <Route path={'/index'} element={ <Pages.IndexPage /> } />
                            <Route path={'/territorios/:territory'} element={ <Pages.TelephonicPage /> } />
                            <Route path={'/usuario'} element={ <Pages.UserPage /> } />
                            {/* Private Admins */}
                            <Route path={'/admins'} element={ <Pages.AdminsPage /> } />
                            <Route path={'/celulares-admins'} element={ <Pages.CampaignAdminsPage /> } />
                            <Route path={'/gmail'} element={ <Pages.GmailTokensPage /> } />
                            <Route path={'/casa-en-casa/:territory'} element={ <Pages.HouseToHousePage /> } />
                            <Route path={'/logs'} element={ <Pages.LogsPage /> } />
                            <Route path={'/estadisticas'} element={ <Pages.StatisticsPage /> } />
                            {/* * */}
                            <Route path={'*'} element={ <Pages.HomePage /> } />
                        </Routes>

                        <DarkModeButton />

                        {showingAlertModal && <AlertModal />}
                        
                    </div>

                    <Footer />

                </div>
            </GoogleReCaptchaProvider>
        </Suspense>
    )
}
