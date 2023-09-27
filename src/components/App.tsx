import { AlertModal, DarkModeButton, FloatingWidgets, Footer, LoadingModal, NavBar } from './commons'
import { breakingPoint } from '../constants'
import { changeMobileModeReducer, logoutReducer, refreshUserReducer, setConfigurationReducer } from '../store'
import { getUserByTokenService } from '../services'
import { MainRouter } from './routers/MainRouter'
import { Suspense, useEffect } from 'react'
import { typeRootState } from '../models'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export const App = () => {
    const { isDarkMode, isMobile, showingAlertModal, showingLoadingModal } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        showingLoadingModal: state.loadingModal.showingLoadingModal,
        showingAlertModal: state.alertModal.showingAlertModal
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
                    <MainRouter />
                    <DarkModeButton />
                </div>

                <Footer />

            </div>
        </Suspense>
    )
}
