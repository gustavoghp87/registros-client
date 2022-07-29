import { useEffect, useState } from 'react'
import { Card, Button, Form, FloatingLabel } from 'react-bootstrap'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { H2 } from '../commons'
import { refreshUser, setValuesAndOpenAlertModalReducer } from '../../store'
import { changePswService, getUserByTokenService, logoutAllService } from '../../services/userServices'
import { primary, typeAppDispatch, typeRootState, typeUser } from '../../models'

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

    const openAlertModalHandler = (title: string, message: string): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message
        }))
    }

    const openConfirmModalHandler = (option: 1|2): void => {
        if (option === 2) {
            if (!psw || !newPsw || psw.length < 8) return openAlertModalHandler("Completar los campos primero", "")
            if (newPsw.length < 8) return openAlertModalHandler("La clave debe tener al menos 8 caracteres", "")
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
        if (response && response.newToken) openAlertModalHandler("Clave cambiada con éxito", "")
        else if (response && response.wrongPassword) openAlertModalHandler("Clave incorrecta", "")
        else openAlertModalHandler("Algo falló", "")
    }

    const logoutAll = async (): Promise<void> => {
        const success: boolean = await logoutAllService()
        if (!success) return openAlertModalHandler("Algo falló", "Intentar de nuevo")
        openAlertModalHandler("Cierre exitoso", "")
    }

    const getAssignedTerritoriesSorted = (): number[] => {
        if (user && user.asign && user.asign.length) {
            let sorted: number[] = [...user.asign]
            sorted = sorted.sort((a: number, b: number) => a - b)
            return sorted
        } else {
            return []
        }
    }

    useEffect(() => {
        getUserByTokenService().then((user: typeUser|null) => {
            if (user) dispatch(refreshUser(user))
        })
    }, [dispatch])

    return (
    <>
        <H2 title={"Usuario"} />

        {user &&
        <>
            <Card
                className={`text-center ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{ padding: '25px', margin: '30px auto' }}
            >
                
                <h1 className={'mt-2'}> {user.email} </h1>
                
                <div className={'mt-4'}>

                    <h3> Territorios asignados: </h3>

                    {user.asign && !!user.asign.length ?
                        getAssignedTerritoriesSorted().map((territorio: number, index: number) => (
                            <button key={index}
                                className={'btn btn-general-blue d-inline-block text-center active mt-3 mx-1 px-0'}
                                onClick={() => navigate(`/territorios/${territorio}`)}
                                style={{ fontWeight: 'bolder', width: '65px' }}
                            >
                                {territorio}
                            </button>
                        ))
                    :
                        <h4>Ninguno</h4>
                    }
                </div>

                {!show && <>
                    <button
                        className={'btn btn-general-red'}
                        onClick={() => setShow(true)}
                        style={{ maxWidth: '400px', margin: '50px auto 0 auto' }}
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

            </Card>


            {show &&
                <Card className={isDarkMode ? 'bg-dark text-white' : ''}
                    style={{ padding: '25px', margin: '60px auto', maxWidth: '450px' }}>

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

                    <Button
                        className={'my-2'}
                        onClick={() => openConfirmModalHandler(2)}
                        type={'submit'}
                        variant={primary}
                    >
                        Aceptar
                    </Button>

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
