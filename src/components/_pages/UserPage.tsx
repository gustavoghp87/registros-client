import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Form, FloatingLabel } from 'react-bootstrap'
import { H2, Hr } from '../commons'
import { logoutReducer, refreshUserReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { changePswService, getUserByTokenService, logoutAllService } from '../../services/userServices'
import { typeAppDispatch, typeRootState, typeUser } from '../../models'

export const UserPage = () => {
    
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [newPsw, setNewPsw] = useState('')
    const [psw, setPsw] = useState('')
    const [show, setShow] = useState(false)
    // const [assignedPacks, setAssignedPacks] = useState<number[]>([])

    const openAlertModalHandler = (title: string, message: string, animation?: number): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation
        }))
    }

    const openConfirmModalHandler = (option: 1|2): void => {
        if (option === 2) {
            if (!psw || !newPsw || psw.length < 8) return openAlertModalHandler("Completar los campos primero", "", 2)
            if (newPsw.length < 8) return openAlertModalHandler("La clave debe tener al menos 8 caracteres", "", 2)
        }
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: option === 1 ? "¿Cerrar sesiones?" : "Atención",
            message: option === 1 ? "Esta opción cerrará todas las sesiones en todos los dispositivos en que se haya ingresado excepto en este"
                : `Se cambiará la contraseña de ${psw} a ${newPsw}`,
            execution: option === 1 ? logoutAll : changePswHandler
        }))
    }
    
    const changePswHandler = async (): Promise<void> => {
        const response = await changePswService(psw, newPsw, null)
        setPsw('')
        setNewPsw('')
        if (response && response.newToken) openAlertModalHandler("Clave cambiada con éxito", "", 1)
        else if (response && response.wrongPassword) openAlertModalHandler("Clave incorrecta", "", 2)
        else openAlertModalHandler("Algo falló", "", 2)
    }

    const logoutAll = async (): Promise<void> => {
        const success: boolean = await logoutAllService()
        if (!success) return openAlertModalHandler("Algo falló", "Intentar de nuevo", 2)
        openAlertModalHandler("Cierre exitoso", "", 1)
    }

    useEffect(() => {
        getUserByTokenService().then((user: typeUser|false|null) => {
            if (user) return dispatch(refreshUserReducer(user))
            if (user === false) dispatch(logoutReducer())
            navigate('/acceso')
        })
        // getCampaignAssignmentsByUser().then((campaignPacks: number[]|null) => {
        //     if (campaignPacks && campaignPacks.length) setAssignedPacks(campaignPacks)
        // })
    }, [dispatch, navigate])

    return (
        <>
            <H2 title={"Usuario"} />

            {user &&
                <>
                    <div
                        className={`card text-center ${isDarkMode ? 'bg-dark text-white' : ''}`}
                        style={{ margin: '30px auto', maxWidth: '700px', padding: '25px' }}
                    >
                        
                        <h1 className={'mt-2 py-2'}> {user.email} </h1>

                        <Hr />
                        
                        <div className={'my-4'}>

                            <h3> Territorios de Casa en Casa asignados: </h3>

                            {user && !!user.hthAssignments?.length ?
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

                            {user && !!user.phoneAssignments?.length ?
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

                        {!show && <>
                            <button
                                className={'btn btn-general-red'}
                                onClick={() => setShow(true)}
                                style={{ maxWidth: '400px', margin: '40px auto 0 auto' }}
                            >
                                Cambiar contraseña
                            </button>

                            <button
                                className={'btn btn-general-red'}
                                onClick={() => openConfirmModalHandler(1)}
                                style={{ maxWidth: '400px', margin: '30px auto 30px auto' }}
                            >
                                Cerrar sesión en todos los dispositivos
                            </button>
                        </>}

                    </div>


                    {show &&
                        <Card className={isDarkMode ? 'bg-dark text-white' : ''}
                            style={{ margin: '60px auto', maxWidth: '450px', padding: '25px' }}
                        >

                            <Card.Title className={'text-center mb-4'}> CAMBIAR CONTRASEÑA </Card.Title>

                            <Form.Group>
                                <FloatingLabel
                                    label={"Contraseña actual"}
                                    className={'mb-3 text-secondary'}
                                >
                                    <Form.Control type={'text'}
                                        autoFocus
                                        onChange={(event: any) => setPsw(event.target.value)}
                                        placeholder={"Contraseña actual"}
                                        value={psw}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group>
                                <FloatingLabel
                                    label={"Nueva contraseña"}
                                    className={'mb-3 text-secondary'}
                                >
                                    <Form.Control type={'text'}
                                        onChange={(event: any) => setNewPsw(event.target.value)}
                                        placeholder={"Nueva contraseña"}
                                        value={newPsw}
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <button
                                className={'btn btn-general-blue my-2'}
                                onClick={() => openConfirmModalHandler(2)}
                            >
                                Aceptar
                            </button>

                            <button className={'btn btn-general-red'} onClick={() => setShow(false)}>
                                Cancelar
                            </button>

                        </Card>
                    }
                </>
            }
        </>
    )
}
