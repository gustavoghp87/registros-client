import { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useDispatch, useSelector } from 'react-redux'
import * as Pages from './pages'
import { AlertModal, DarkModeButton, FloatingWidgets, Footer, NavBar } from './commons'
import { recaptchaPublicKey } from '../config'
import { changeMobileModeReducer, refreshUser } from '../store'
import { typeAppDispatch, typeRootState, typeUser } from '../models'
import { getUserByTokenService } from '../services/userServices'

export const App = () => {
    
    const { isDarkMode, isMobile, showingAlertModal, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        showingAlertModal: state.alertModal.showingAlertModal,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()

    useEffect(() => {
        window.addEventListener('resize', (event: any) => {
            const width: number = event.target.screen.width
            if ((isMobile && width >= 992) || (!isMobile && width < 992)) {
                dispatch(changeMobileModeReducer({ isMobile: width < 992}))
            }
        })
    }, [dispatch, isMobile])

    useEffect(() => {
        getUserByTokenService().then((user: typeUser|null) => {
            if (user) dispatch(refreshUser(user))
        })
    }, [dispatch])

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
                            <Route path={'/'} element={ <Pages.HomePage /> } />
                            <Route path={'/celulares/:id'} element={ <Pages.CampaignPage /> } />
                            <Route path={'/privacidad'} element={ <Pages.PrivacyPolicyPage /> } />
                            <Route path={'/recovery/:id'} element={ <Pages.RecoveryPage /> } />
                            <Route path={'/servicio'} element={ <Pages.TermsOfServicePage /> } />

                            {(!user || !user.isAuth) ?
                                <Route path={'/acceso'} element={<Pages.LoginPage />} />
                                :
                                <>
                                    <Route path={'/congregacion'} element={<Pages.CongregationPage />} />
                                    <Route path={'/index'} element={<Pages.IndexPage />} />
                                    <Route path={'/territorios/:territory'} element={<Pages.TelephonicPage />} />
                                    <Route path={'/usuario'} element={<Pages.UserPage /> } />
                                </>
                            }

                            {user && user.isAdmin && <>
                                <Route path={'/admins'} element={<Pages.AdminsPage />} />
                                <Route path={'/celulares-admins'} element={<Pages.CampaignAdminsPage />} />
                                <Route path={'/casa-en-casa/:territory'} element={<Pages.HouseToHousePage />} />
                                <Route path={'/gmail'} element={<Pages.GmailTokensPage />} />
                                <Route path={'/logs'} element={<Pages.LogsPage />} />
                                <Route path={'/estadisticas'} element={<Pages.StatisticsPage />} />
                            </>}

                            <Route path={'/*'} element={ <Navigate to={'/'} replace /> } />
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
