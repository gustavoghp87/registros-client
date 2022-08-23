import { useEffect } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { CampaignSelector, HouseToHouseSelector, TelephonicSelector } from '../selector'
import { logoutReducer, refreshUserReducer } from '../../store'
import { getUserByTokenService } from '../../services/userServices'
import { typeAppDispatch, typeRootState, typeUser } from '../../models'

export const SelectorPage = () => {

    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    
    useEffect(() => {
        window.scrollTo(0, 0)
        getUserByTokenService().then((user: typeUser|false|null) => {
            if (user) return dispatch(refreshUserReducer(user))
            if (user === false) dispatch(logoutReducer())
            navigate('/acceso')
        })
    }, [dispatch, navigate])

    return (
        <>
            {user && (user.isAdmin || user.email === 'usuarioprueba@misericordia') && <>
                <HouseToHouseSelector />

                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
                <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
            </>}

            <TelephonicSelector />

            <hr style={{ color: isDarkMode ? 'white' : 'black' }} />
            <hr style={{ color: isDarkMode ? 'white' : 'black' }} />

            <CampaignSelector />
        </>
    )
}
