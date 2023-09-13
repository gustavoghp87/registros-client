import { getUserByTokenService, logoutAllService } from '../../services'
import { H2, Hr } from '../commons'
import { logoutReducer, refreshUserReducer, setConfigurationReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { UserChangeEmail } from '../user/UserChangeEmail'
import { UserChangePassword } from '../user/UserChangePassword'

export const UserPage = () => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showChangeEmail, setShowChangeEmail] = useState(false)
    const [showChangePsw, setShowChangePsw] = useState(false)
    // const [assignedPacks, setAssignedPacks] = useState<number[]>([])

    const openAlertModalHandler = (title: string, message: string, animation?: number): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation
        }))
    }

    const openConfirmModalHandler = (title: string, message: string, execution: Function): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title,
            message,
            execution
        }))
    }

    const logoutAll = async (): Promise<void> => {
        const success: boolean = await logoutAllService()
        if (!success)
            return openAlertModalHandler("Algo falló", "Intentar de nuevo", 2)
        openAlertModalHandler("Cierre exitoso", "", 1)
    }

    useEffect(() => {
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
        // getCampaignAssignmentsByUser().then((campaignPacks: number[]|null) => {
        //     if (campaignPacks && campaignPacks.length) setAssignedPacks(campaignPacks)
        // })
    }, [dispatch, navigate])

    return (
        <>
            <H2 title={"Usuario"} />

            <div
                className={`card text-center ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{ margin: '30px auto', maxWidth: '700px', padding: '25px' }}
            >
                
                <h1 className={'mt-2 py-2'}> {user.email} </h1>

                <Hr />
                
                <div className={'my-4'}>

                    <h3> Territorios de Casa en Casa asignados: </h3>

                    {!!user.hthAssignments?.length ?
                        ([...user.hthAssignments]).sort((a: number, b: number) => a - b).map((territoryNumber: number) => (
                            <button key={territoryNumber}
                                className={'btn btn-general-blue d-inline-block text-center mt-3 mx-1 px-0'}
                                onClick={() => navigate(`/casa-en-casa/${territoryNumber}`)}
                                style={{ fontWeight: 'bolder', width: '65px' }}
                            >
                                {territoryNumber}
                            </button>
                        ))
                    :
                        <h4> Ninguno </h4>
                    }
                </div>

                <Hr />
                
                <div className={'my-4'}>

                    <h3> Territorios de Telefónica asignados: </h3>

                    {!!user.phoneAssignments?.length ?
                        [...user.phoneAssignments].sort((a: number, b: number) => a - b).map((territoryNumber: number) => (
                            <button key={territoryNumber}
                                className={'btn btn-general-red d-inline-block text-center mt-3 mx-1 px-0'}
                                onClick={() => navigate(`/telefonica/${territoryNumber}`)}
                                style={{ fontWeight: 'bolder', width: '65px' }}
                            >
                                {territoryNumber}
                            </button>
                        ))
                    :
                        <h4> Ninguno </h4>
                    }
                </div>

                {/* {!!assignedPacks?.length &&
                    <>
                        <Hr />

                        <div className={'my-4'}>

                            <h3> Paquetes de la Campaña 2022 asignados: </h3>

                            {!!assignedPacks.length ?
                                assignedPacks.sort((a, b) => a - b).map((packNumber: number) => (
                                    <button key={packNumber}
                                        className={'btn btn-success d-inline-block text-center mt-3 mx-1 px-0'}
                                        onClick={() => navigate(`/celulares/${packNumber}`)}
                                        style={{ fontWeight: 'bolder', width: '65px' }}
                                    >
                                        {packNumber}
                                    </button>
                                ))
                                :
                                <h4> Ninguno </h4>
                            }
                        </div>
                    </>
                } */}

                <Hr />

                {!showChangePsw && !showChangeEmail && <>
                    <button
                        className={'btn btn-general-blue'}
                        onClick={() => setShowChangePsw(true)}
                        style={{ width: '350px', margin: '40px auto 0 auto' }}
                    >
                        Cambiar contraseña
                    </button>

                    <button
                        className={'btn btn-general-blue'}
                        onClick={() => setShowChangeEmail(true)}
                        style={{ width: '350px', margin: '30px auto 0 auto' }}
                    >
                        Cambiar de dirección de email
                    </button>

                    <button
                        className={'btn btn-general-blue'}
                        onClick={() => openConfirmModalHandler("¿Cerrar sesiones?", "Esta opción cerrará todas las sesiones en todos los dispositivos en que se haya ingresado excepto en este", logoutAll)}
                        style={{ width: '350px', margin: '30px auto 30px auto' }}
                    >
                        Cerrar sesión en todos los dispositivos
                    </button>

                </>}

            </div>


            {showChangePsw &&
                <UserChangePassword
                    openAlertModalHandler={openAlertModalHandler}
                    openConfirmModalHandler={openConfirmModalHandler}
                    setShowChangePsw={setShowChangePsw}
                />
            }

            {showChangeEmail &&
                <UserChangeEmail
                    openAlertModalHandler={openAlertModalHandler}
                    openConfirmModalHandler={openConfirmModalHandler}
                    setShowChangeEmail={setShowChangeEmail}
                />
            }
        </>
    )
}
