import { getUserByTokenService } from '../../services/userServices'
import { HouseToHouseSelector, TelephonicSelector } from '../selector'
import { Hr } from '../commons'
import { logoutReducer, refreshUserReducer } from '../../store'
import { NavigateFunction, useNavigate } from 'react-router'
import { subirAlTop } from '../../services'
import { typeAppDispatch, typeRootState, typeUser } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

export const SelectorPage = () => {

    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    
    useEffect(() => {
        subirAlTop()
        getUserByTokenService().then((user: typeUser|false|null) => {
            if (user) {
                dispatch(refreshUserReducer(user))
                if (localStorage.getItem('campaignSept2022')) localStorage.removeItem('campaignSept2022')
                return
            }
            if (user === false) dispatch(logoutReducer())
            navigate('/acceso')
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
