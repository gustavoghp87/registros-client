import { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { typeRootState } from '../store/store'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { H2 } from './css/css'
import { useAuth } from '../context/authContext'
import { changePswService, logoutAllService } from '../services/tokenServices'
import { typeUser } from '../models/user'

export const UserPage = () => {
    
    const user: typeUser|undefined = useAuth().user
    const [show, setShow] = useState(false)
    const [psw, setPsw] = useState('')
    const [newPsw, setNewPsw] = useState('')
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const dispatch = useDispatch()

    const openAlertModalHandler = (title: string, message: string): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message
        }))
    }

    const openConfirmModalHandler = (option: 1|2): void => {
        if (!psw || !newPsw || psw.length < 8) return openAlertModalHandler("Completar los campos primero", "")
        if (newPsw.length < 8) return openAlertModalHandler("La clave debe tener al menos 8 caracteres", "")
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
        let sorted: number[] = []
        if (user && user.asign && user.asign.length) sorted = user.asign.sort((a: number, b: number) => a - b)
        return sorted
    }


    return (
    <>
        <H2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}> Usuario </H2>

        {user &&
        <>
            <Card
                className={`text-center ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{ padding: '25px', margin: '30px auto' }}
            >
                
                <p className={'h1 mt-2'}> {user.email} </p>
                
                <div className={'mt-4 d-inline-block'}>
                    <h3 className={'d-inline-block'}> Territorios asignados: &nbsp; &nbsp; </h3>
                    <br />
                    {user.asign && getAssignedTerritoriesSorted().map((territorio: number, index: number) => (
                        <Button key={index} className={'d-inline-block text-center active mt-3 px-3 mx-1'} style={{ width: '55px' }}>
                            {territorio}
                        </Button>
                    ))}
                    {(!user.asign || !user.asign.length) && <h4>Ninguno</h4>}

                </div>

                <Button
                    variant={'danger'}
                    style={{ display: show ? 'none' : 'block', maxWidth: '400px', margin: '50px auto 0 auto' }}
                    onClick={() => setShow(true)}>
                    Cambiar contraseña
                </Button>

                <Button
                    variant={'danger'}
                    style={{ display: show ? 'none' : 'block', maxWidth: '400px', margin: '30px auto 30px auto' }}
                    onClick={() => openConfirmModalHandler(1)}>
                    Cerrar sesión en todos los dispositivos
                </Button>

            </Card>

            {show &&
                <Card className={isDarkMode ? 'bg-dark text-white' : ''}
                    style={{ padding: '25px', margin: '60px auto', maxWidth: '600px' }}>
                    <Card.Title className={'mb-4'}> CAMBIAR CONTRASEÑA </Card.Title>
                    <Form.Group>
                        <Form.Label> Contraseña actual </Form.Label>
                        <Form.Control type={'text'}
                            placeholder={"Contraseña actual"}
                            value={psw}
                            onChange={(event: any) => setPsw(event.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> Nueva contraseña </Form.Label>
                        <Form.Control type={'text'}
                            placeholder={"Nueva contraseña"}
                            value={newPsw}
                            onChange={(event: any) => setNewPsw(event.target.value)}
                        />
                    </Form.Group>

                    <Button
                        variant={'primary'}
                        type={'submit'}
                        className={'mt-4 mb-2'}
                        onClick={() => openConfirmModalHandler(2)}
                    >
                        Aceptar
                    </Button>

                    <Button variant={'danger'} onClick={() => setShow(false)}>
                        Cancelar
                    </Button>
                </Card>
            }
        </>
        }
    </>
    )
}
