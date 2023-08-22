import { getUserByTokenService } from '../../services/userServices'
import { goToTop } from '../../services'
import { HouseToHouseSelector, TelephonicSelector } from '../selector'
import { Hr } from '../commons'
import { logoutReducer, refreshUserReducer, setConfigurationReducer } from '../../store'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export const SelectorPage = () => {
    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(() => {
        goToTop()
        getUserByTokenService().then(response => {
            if (!response.user || !response.config) {
                if (response.user === false)
                    dispatch(logoutReducer())
                navigate('/acceso')
                return
            }
            dispatch(refreshUserReducer(response.user))
            dispatch(setConfigurationReducer(response.config))
        })
    }, [dispatch, navigate])

    return (
        <>
            {!!user.hthAssignments?.length &&
                <>
                    <HouseToHouseSelector />

                    <Hr />
                    <Hr />
                </>
            }

            <TelephonicSelector />

            {/* <Hr />
            <Hr />

            <CampaignSelector /> */}
        </>
    )
}
