import { useState } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import { ReturnBtn } from './commons/Return'
import { H2 } from './css/css'
import { changePswService, logoutAllService } from '../services/tokenServices'
import { isMobile } from '../services/functions'
import { typeUser } from '../models/typesUsuarios'

export const UserPage = (props: any) => {
    
    const user: typeUser = props.user
    const [show, setShow] = useState(false)
    const [psw, setPsw] = useState('')
    const [newPsw, setNewPsw] = useState('')
    
    const changePswHandler = async (): Promise<void> => {
        setPsw('')
        setNewPsw('')
        alert("Cambiando password de " + psw + " a " + newPsw)
        const response: any|null = await changePswService(psw, newPsw, null)
        if (response && response.newToken) { alert("Clave cambiada con éxito") }
        else if (response && response.wrongPassword) alert("Clave incorrecta")
        else alert("Algo falló")
    }

    const logoutAllHandler = async (): Promise<void> => {
        confirmAlert({
            title: `¿Cerrar sesiones?`,
            message: `Esta opción cerrará todas las sesiones en todos los dispositivos en que se haya ingresado excepto en este`,
            buttons: [
                {
                    label: 'ACEPTAR',
                    onClick: () => logoutAll()
                },
                {
                    label: 'CANCELAR',
                    onClick: () => {}
                }
            ]
        })
        const logoutAll = async (): Promise<void> => {
            const success: boolean = await logoutAllService()
            if (success) alert("Cierre exitoso")
            else alert("Algo falló; intente de nuevo")
        }
    }

    const getAssignedTerritoriesSorted = (): number[] => {
        let sorted = [0]
        if (user && user.asign)
            sorted = user.asign.sort((a: number, b: number) => a - b)
        return sorted
    }
    

    return (
        <>
            {ReturnBtn()}

            <H2 style={{ textAlign: 'center' }}> Usuario </H2>

            {user &&
            <>
                <Card style={{ padding: '25px', margin: '30px auto' }}>
                    
                    {isMobile ?
                    <>
                        <h4> Usuario: {user.email} </h4>
                        <br/>

                        <div className={'d-inline-block'}>
                            <h4 className={'d-inline-block'}> Territorios asignados: &nbsp; &nbsp; </h4>

                            {user.asign &&
                                getAssignedTerritoriesSorted().map((territorio: number, index: number) => (
                                    <h4 key={index} className={'d-inline-block'}>
                                        {territorio} &nbsp; &nbsp;
                                    </h4>
                                ))
                            }

                        </div>
                    </>
                    :
                    <>
                        <h3> Usuario: {user.email} </h3>
                        
                        <div className={'d-inline-block'}>
                            <h3 className={'d-inline-block'}> Territorios asignados: &nbsp; &nbsp; </h3>

                            {user.asign &&
                                getAssignedTerritoriesSorted().map((territorio: number, index: number) => (
                                    <h3 key={index} className={'d-inline-block'}>
                                        {territorio} &nbsp; &nbsp;
                                    </h3>
                                ))
                            }

                        </div>
                    </>
                    }

                    <Button
                        variant={'danger'}
                        style={{ display: show ? 'none' : 'block', maxWidth: '400px', margin: '20px auto 0 auto' }}
                        onClick={() => setShow(true)}>
                        Cambiar contraseña
                    </Button>

                    <Button
                        variant={'danger'}
                        style={{ display: show ? 'none' : 'block', maxWidth: '400px', margin: '20px auto 0 auto' }}
                        onClick={() => logoutAllHandler()}>
                        Cerrar sesión en todos los dispositivos
                    </Button>

                </Card>

                {show &&
                    <Card style={{ padding: '25px', margin: '60px auto', maxWidth: '600px'}}>
                        <Card.Title className={'mb-4'}> CAMBIAR CONTRASEÑA </Card.Title>
                        <Form.Group>
                            <Form.Label> Contraseña actual </Form.Label>
                            <Form.Control type="text"
                                placeholder="Contraseña actual"
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
