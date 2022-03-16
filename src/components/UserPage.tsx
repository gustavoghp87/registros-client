import { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { ReturnBtn } from './commons/Return'
import { ConfirmAlert } from './commons/ConfirmAlert'
import { useAuth } from '../context/authContext'
import { H2 } from './css/css'
import { changePswService, logoutAllService } from '../services/tokenServices'
import { typeUser } from '../models/typesUsuarios'

export const UserPage = () => {
    
    const user: typeUser|undefined = useAuth().user
    const [show, setShow] = useState(false)
    const [psw, setPsw] = useState('')
    const [newPsw, setNewPsw] = useState('')
    const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
    
    const changePswHandler = async (): Promise<void> => {
        alert("Cambiando password de " + psw + " a " + newPsw)
        const response: any|null = await changePswService(psw, newPsw, null)
        if (response && response.newToken) { alert("Clave cambiada con éxito") }
        else if (response && response.wrongPassword) alert("Clave incorrecta")
        else alert("Algo falló")
        setPsw('')
        setNewPsw('')
    }

    const logoutAll = async (): Promise<void> => {
        setShowConfirmAlertHandler()
        const success: boolean = await logoutAllService()
        if (!success) return alert("Algo falló; intente de nuevo")
        alert("Cierre exitoso")
    }

    const setShowConfirmAlertHandler = (): void => setShowConfirmAlert(false)

    const getAssignedTerritoriesSorted = (): number[] => {
        let sorted: number[] = []
        if (user && user.asign && user.asign.length) sorted = user.asign.sort((a: number, b: number) => a - b)
        return sorted
    }


    return (
        <>
        {ReturnBtn()}

        {showConfirmAlert &&
            <ConfirmAlert
                title={"¿Cerrar sesiones?"}
                message={"Esta opción cerrará todas las sesiones en todos los dispositivos en que se haya ingresado excepto en este"}
                execution={logoutAll}
                cancelAction={setShowConfirmAlertHandler}
            />
        }

        <H2 className={'text-center'}> Usuario </H2>

        {user &&
        <>
            <Card className={'text-center'} style={{ padding: '25px', margin: '30px auto' }}>
                
                <p className={'h1 mt-2'}> {user.email} </p>
                
                <div className={'mt-4 d-inline-block'}>
                    <h3 className={'d-inline-block'}> Territorios asignados: &nbsp; &nbsp; </h3>
                    <br />
                    {user.asign && getAssignedTerritoriesSorted().map((territorio: number, index: number) => (
                        <Button key={index} className={'d-inline-block text-center active mt-3 px-3 mx-1'} style={{ width: '55px' }}>
                            {territorio}
                        </Button>
                    ))}

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
                    onClick={() => setShowConfirmAlert(true)}>
                    Cerrar sesión en todos los dispositivos
                </Button>

            </Card>

            {show &&
                <Card style={{ padding: '25px', margin: '60px auto', maxWidth: '600px' }}>
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

                    <Button variant={'primary'} className={'mt-4 mb-2'} type={'submit'} onClick={() => changePswHandler()}>
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
