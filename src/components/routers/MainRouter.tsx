import { Navigate, Route, Routes } from 'react-router-dom'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'
import * as Pages from '../_pages'

export const MainRouter = () => {
    const { config, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        user: state.user
    }))

    return (
        <Routes>
            <Route path={'/'} element={ <Pages.HomePage /> } />
            <Route path={'/celulares/:id'} element={ <Pages.CampaignPage /> } />
            <Route path={'/privacidad'} element={ <Pages.PrivacyPolicyPage /> } />
            <Route path={'/recovery'} element={ <Pages.RecoveryPage /> } />
            <Route path={'/nuevo-usuario'} element={ <Pages.NewUserPage /> } />
            <Route path={'/servicio'} element={ <Pages.TermsOfServicePage /> } />
            <Route path={'/edificio/:congregation/:territoryNumber/:block/:face/:streetNumber'} element={<Pages.HTHBuildingPage />} />
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
    )
}
