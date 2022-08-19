import { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as Pages from './_pages'
import { AlertModal, DarkModeButton, FloatingWidgets, Footer, LoadingModal, NavBar } from './commons'
import { changeMobileModeReducer, refreshUserReducer } from '../store'
import { breakingPoint, typeAppDispatch, typeRootState, typeUser } from '../models'
import { getUserByTokenService } from '../services/userServices'

export const App = () => {
    
    const { isDarkMode, isMobile, showingAlertModal, showingLoadingModal, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        showingLoadingModal: state.loadingModal.showingLoadingModal,
        showingAlertModal: state.alertModal.showingAlertModal,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    
    useEffect(() => {
        window.addEventListener('resize', (event: any) => {
            const width: number = event.target.screen.width
            if ((isMobile && width >= breakingPoint) || (!isMobile && width < breakingPoint)) {
                dispatch(changeMobileModeReducer({ isMobile: width < breakingPoint }))
            }
        })
    }, [dispatch, isMobile])

    useEffect(() => {
        getUserByTokenService().then((user: typeUser|null) => {
            if (user) dispatch(refreshUserReducer(user))
        })
    }, [dispatch])

    return (
        <Suspense fallback={(<div> Cargando... </div>)}>

            <div style={{ backgroundColor: isDarkMode ? 'black' : 'white' }}>

                <div style={{ position: 'fixed', width: '100%', zIndex: 4 }}>
                    <NavBar />
                    <FloatingWidgets />
                    {showingAlertModal && <AlertModal />}
                    {showingLoadingModal && <LoadingModal />}
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
                        <Route path={'/reunion'} element={ <Pages.LastMeetingPage /> } />

                        {(!user || !user.isAuth) ?
                            <Route path={'/acceso'} element={<Pages.LoginPage />} />
                            :
                            <>
                                <Route path={'/congregacion'} element={<Pages.CongregationPage />} />
                                <Route path={'/selector'} element={<Pages.SelectorPage />} />
                                <Route path={'/telefonica/:territory'} element={<Pages.TelephonicPage />} />
                                <Route path={'/usuario'} element={<Pages.UserPage /> } />
                            </>
                        }

                        {user && user.isAdmin && <>
                            <Route path={'/admins'} element={<Pages.AdminsPage />} />
                            <Route path={'/casa-en-casa/:territory'} element={<Pages.HouseToHousePage />} />
                            <Route path={'/gmail'} element={<Pages.GmailTokensPage />} />
                        </>}

                        <Route path={'/*'} element={ <Navigate to={'/'} replace /> } />
                    </Routes>

                    <DarkModeButton />

                </div>

                <Footer />

            </div>
        </Suspense>
    )
}
