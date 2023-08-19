import { AlertModal, DarkModeButton, FloatingWidgets, Footer, LoadingModal, NavBar } from './commons'
import { breakingPoint, typeRootState, typeUser } from '../models'
import { changeMobileModeReducer, logoutReducer, refreshUserReducer } from '../store'
import { getUserByTokenService } from '../services/userServices'
import { Location, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Pages from './_pages'

export const App = () => {
    const { isDarkMode, isMobile, showingAlertModal, showingLoadingModal, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        showingLoadingModal: state.loadingModal.showingLoadingModal,
        showingAlertModal: state.alertModal.showingAlertModal,
        user: state.user
    }))
    const dispatch = useDispatch()
    const location: Location = useLocation()
    
    useEffect(() => {
        window.addEventListener('resize', (event: any) => {
            const width: number = event.target.screen.width
            if ((isMobile && width >= breakingPoint) || (!isMobile && width < breakingPoint)) {
                dispatch(changeMobileModeReducer({ isMobile: width < breakingPoint }))
            }
        })
    }, [dispatch, isMobile])

    useEffect(() => {
        if (location.pathname === '/selector') return
        getUserByTokenService().then((user0: typeUser|false|null) => {
            if (user0) return dispatch(refreshUserReducer(user0))
            if (user0 === false) return dispatch(logoutReducer())
            // alert("No se pudo recuperar el usuario")
        })
    }, [dispatch, location.pathname])

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
                        <Route path={'/recovery'} element={ <Pages.RecoveryPage /> } />
                        <Route path={'/servicio'} element={ <Pages.TermsOfServicePage /> } />
                        <Route path={'/edificio/:territoryNumber/:block/:face/:streetNumber'} element={ <Pages.HTHBuildingPage /> } />
                        <Route path={'/reunion'} element={ <Pages.LastMeetingPage /> } />
                        <Route path={'/testing'} element={ <Pages.TestingPage /> } />

                        {(!user || !user.isAuth) ?
                            <Route path={'/acceso'} element={<Pages.LoginPage />} />
                            :
                            <>
                                <Route path={'/tablero'} element={<Pages.BoardPage />} />
                                <Route path={'/selector'} element={<Pages.SelectorPage />} />
                                <Route path={'/telefonica/:territoryNumber'} element={<Pages.TelephonicPage />} />
                                <Route path={'/usuario'} element={<Pages.UserPage /> } />
                            </>
                        }

                        {user && user.isAdmin && <>
                            <Route path={'/admins'} element={<Pages.AdminsPage />} />
                            <Route path={'/gmail'} element={<Pages.GmailTokensPage />} />
                        </>}

                        {user && user.hthAssignments?.length &&
                            <Route path={'/casa-en-casa/:territoryNumber'} element={<Pages.HouseToHousePage />} />
                        }

                        <Route path={'/*'} element={ <Navigate to={'/'} replace /> } />
                    </Routes>

                    <DarkModeButton />

                </div>

                <Footer />

            </div>
        </Suspense>
    )
}
