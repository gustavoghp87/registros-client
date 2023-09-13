import { AlertModal, DarkModeButton, FloatingWidgets, Footer, LoadingModal, NavBar } from './commons'
import { breakingPoint } from '../constants'
import { changeMobileModeReducer, logoutReducer, refreshUserReducer, setConfigurationReducer } from '../store'
import { getUserByTokenService } from '../services'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { typeRootState } from '../models'
import { useDispatch, useSelector } from 'react-redux'
import * as Pages from './_pages'

export const App = () => {
    const { config, isDarkMode, isMobile, showingAlertModal, showingLoadingModal, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        showingLoadingModal: state.loadingModal.showingLoadingModal,
        showingAlertModal: state.alertModal.showingAlertModal,
        user: state.user
    }))
    const dispatch = useDispatch()
    const location = useLocation()
    
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
        getUserByTokenService().then(response => {
            if (!response.user || !response.config) {
                if (response.user === false) {
                    dispatch(logoutReducer())
                    return
                }
                // dispatch(setValuesAndOpenAlertModalReducer({
                //     title: "No se pudo recuperar el usuario",
                //     message: "",
                //     mode: 'alert',
                //     animation: 2
                // }))
                return
            }
            dispatch(refreshUserReducer(response.user))
            dispatch(setConfigurationReducer(response.config))
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
                        <Route path={'/nuevo-usuario'} element={ <Pages.NewUserPage /> } />
                        <Route path={'/servicio'} element={ <Pages.TermsOfServicePage /> } />
                        <Route path={'/edificio/:congregation/:territoryNumber/:block/:face/:streetNumber'} element={ <Pages.HTHBuildingPage /> } />
                        <Route path={'/reunion'} element={ <Pages.LastMeetingPage /> } />
                        <Route path={'/testing'} element={ <Pages.TestingPage /> } />

                        {user.isAuth ?
                            <>
                                {!!config.googleBoardUrl && <Route path={'/tablero'} element={<Pages.BoardPage />} />}
                                <Route path={'/selector'} element={<Pages.SelectorPage />} />
                                <Route path={'/telefonica/:territoryNumber'} element={<Pages.TelephonicPage />} />
                                <Route path={'/casa-en-casa/:territoryNumber'} element={<Pages.HouseToHousePage />} />
                                <Route path={'/usuario'} element={<Pages.UserPage /> } />
                            </>
                            :
                            <Route path={'/acceso'} element={<Pages.LoginPage />} />
                        }

                        {user.isAdmin && <>
                            <Route path={'/admins'} element={<Pages.AdminsPage />} />
                            <Route path={'/admins/:section'} element={<Pages.AdminsPage />} />
                            <Route path={'/gmail'} element={<Pages.GmailTokensPage />} />
                        </>}

                        {/* {(user.isAdmin || !!user.hthAssignments?.length) &&
                        } */}

                        <Route path={'/*'} element={ <Navigate to={'/'} replace /> } />
                    </Routes>

                    <DarkModeButton />

                </div>

                <Footer />

            </div>
        </Suspense>
    )
}
