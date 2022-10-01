import { useEffect } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Hr } from '../commons'
import { CampaignSelector, HouseToHouseSelector, TelephonicSelector } from '../selector'
import { logoutReducer, refreshUserReducer } from '../../store'
import { getUserByTokenService } from '../../services/userServices'
import { typeAppDispatch, typeRootState, typeUser } from '../../models'

export const SelectorPage = () => {

    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    
    useEffect(() => {
        window.scrollTo(0, 0)
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

            <Hr />
            <Hr />

            <CampaignSelector />
        </>
    )
}
