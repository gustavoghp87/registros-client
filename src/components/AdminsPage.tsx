import { useState, useEffect } from 'react'
import { Card, Button, Pagination, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap'
import { ConfirmAlert } from './commons/ConfirmAlert'
import { ReturnBtn } from './commons/Return'
import { Loading } from './commons/Loading'
import { useAuth } from '../context/authContext'
import io from 'socket.io-client'
import { assignTerritoryService, modifyUserService, getUsersService } from '../services/userServices'
import { changePswOtherUserService } from '../services/tokenServices'
import { SERVER } from '../config'
import { H2 } from './css/css'
import { isMobile } from '../services/functions'
import { typeUser } from '../models/typesUsuarios'
import { danger } from '../models/typesTerritorios'


export const AdminsPage = () => {
    
    const { refreshUser, user } = useAuth()
    const [users, setUsers] = useState<typeUser[]>()
    const [asignVisible, setAsignVisible] = useState<boolean>(false)
    const [groupVisible, setGroupVisible] = useState<boolean>(false)
    const [asig, setAsig] = useState<string[]>([])
    const [desasig, setDesasig] = useState<string[]>([])
    const [viendo, setViendo] = useState<string>("todos")
    const [socket, setSocket] = useState<any>(null)
    const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
    const [email, setEmail] = useState<string>()
    
    useEffect(() => {
        getUsersService().then((users: typeUser[]|null) => { if (users) setUsers(users) })
        if (!socket) {
            const newSocket = io(SERVER, { withCredentials: true })
            newSocket.on("user: change", (updatedUser: typeUser) => {
                getUsersService().then((users: typeUser[]|null) => { if (users) setUsers(users) })
            })
            if (newSocket) setSocket(newSocket)
        }
        if (socket && !socket.connected) { console.log("Sin conectar") } else { console.log("Conectado") }
    }, [socket, socket?.connected])
    

    const modifyUserHandler = async (user_id: string, estado: boolean, role: number, group: number): Promise<void> => {
        const updatedUser: typeUser|null = await modifyUserService(user_id, estado, role, group)
        if (!updatedUser) return alert("Algo falló al modificar usuario")
        sendUpdatedUser(updatedUser)
        refreshUserHandler(user_id)
    }

    const assignTerritoryHandler = (user_id: string, all: boolean, inputId: string | null): void => {
        const assignTerritory = async (user_id: string, asignar: number|null, desasignar: number|null, all: boolean) => {
            const updatedUser: typeUser|null = await assignTerritoryService(user_id, asignar, desasignar, all)
            if (!updatedUser) return alert("Algo falló al cambiar las asignaciones")
            sendUpdatedUser(updatedUser)
            refreshUserHandler(user_id)
        }
        const resetInputHandler = (id: string): void => {
            const input = document.getElementById(id) as HTMLInputElement
            if (input) input.value = ""
        }
        let asignar, desasignar
        if (asig[0] === user_id && asig[1]) asignar = parseInt(asig[1])
        if (desasig[0] === user_id && desasig[1]) desasignar = parseInt(desasig[1])
        if (asignar) assignTerritory(user_id, asignar, null, false)
        if (desasignar) assignTerritory(user_id, null, desasignar, false)
        if (all) assignTerritory(user_id, null, null, all)
        if (inputId) resetInputHandler(inputId)
        setAsig([])
        setDesasig([])
    }

    const sendUpdatedUser = (updatedUser: typeUser): void => {
        if (socket) socket.emit('user: change', updatedUser)
    }

    const refreshUserHandler = (user_id: string): void => {
        if (user_id === user?._id && refreshUser) refreshUser()
    }
    
    const resetPassword = async (): Promise<void> => {
        setShowConfirmAlertHandler()
        if (!email) return
        const response: any|null = await changePswOtherUserService(email)
        if (response && response.success && response.newPassword)
            alert(`Clave reseteada y enviada por email a ${email}\nNueva clave: ${response.newPassword}`)
        else if (response && response.newPassword && response.emailFailed)
            alert(`Se reseteó la contraseña pero falló el envío del email\nNueva clave: ${response.newPassword}`)
        else
            alert(`Algo falló al resetear la contraseña de ${email}`)
    }

    const setShowConfirmAlertHandler = (): void => setShowConfirmAlert(false)


    return (
    <>
        {ReturnBtn()}

        {showConfirmAlert &&
            <ConfirmAlert
                title={"¿Resetear clave?"}
                message={`Esto reseteará la contraseña del usuario ${email}, cerrará su sesión si está abierta y le enviará un correo con la nueva contraseña`}
                execution={resetPassword}
                cancelAction={setShowConfirmAlertHandler}
            />
        }

        <H2 style={{ fontSize: isMobile ? '2.2rem' : '' }}> ADMINISTRADORES </H2>

        <Button variant={danger} style={{ display: 'block', margin:'30px auto 0 auto' }}
            onClick={() => window.location.href='/celulares-admins'}>
            Ir a Campaña Celulares 2022
        </Button>

        <div style={{ display: 'block', margin: isMobile ? '40px auto' : '80px auto' }}>

            {(!users || !users.length) && <Loading />}

            {users && !!users.length &&
            <>
                <h2 className={'text-center mb-3'}> Viendo {viendo} </h2>
                
                <DropdownButton
                    as={ButtonGroup}
                    key={'dropb'}
                    variant={'primary'}
                    title={`Viendo ${viendo}`}
                    style={{ display: 'block', margin: 'auto', textAlign: 'center' }}
                >
                    <Dropdown.Item eventKey="0" onClick={() => setViendo("todos")} active={viendo === "todos"}> Ver todos </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="1" onClick={() => setViendo("Grupo 1")} active={viendo === "Grupo 1"}> Grupo 1 </Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={() => setViendo("Grupo 2")} active={viendo === "Grupo 2"}> Grupo 2 </Dropdown.Item>
                    <Dropdown.Item eventKey="3" onClick={() => setViendo("Grupo 3")} active={viendo === "Grupo 3"}> Grupo 3 </Dropdown.Item>
                    <Dropdown.Item eventKey="4" onClick={() => setViendo("Grupo 4")} active={viendo === "Grupo 4"}> Grupo 4 </Dropdown.Item>
                    <Dropdown.Item eventKey="5" onClick={() => setViendo("Grupo 5")} active={viendo === "Grupo 5"}> Grupo 5 </Dropdown.Item>
                    <Dropdown.Item eventKey="6" onClick={() => setViendo("Grupo 6")} active={viendo === "Grupo 6"}> Grupo 6 </Dropdown.Item>
                </DropdownButton>
            </>
            }

            {users && !!users.length && users.map((user: typeUser, index: number) => {
                    
                let active: number = user.group
                let items: JSX.Element[] = []
                for (let number: number = 1; number <= 6; number++) {
                    items.push(
                        <Pagination.Item key={number}
                            active={number === active}
                            onClick={() => {
                                modifyUserHandler(user._id?.toString(), user.estado, user.role, number)
                            }}
                        >
                            {number}
                        </Pagination.Item>
                    )
                }  
                    
                return (

                    <Card key={index} 
                        style={{
                            width: isMobile ? '332px': '500px',
                            margin: '30px auto 60px auto',
                            backgroundColor: '#f6f6f8',
                            display: viendo === 'todos' || (user && user.group && user.group.toString()) === viendo.slice(-1) ? '' : 'none'
                        }}>
                        
                        <Card.Body style={{ padding: '30px' }}>

                            <Card.Title style={{
                                textAlign: 'center',
                                padding: '20px',
                                fontSize: isMobile ? '1.5rem' : '1.8rem'
                            }}>
                                Usuario: <br/> {user.email}
                            </Card.Title>


                            <hr/>


                            <Card.Text style={{ fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' }}>
                                Territorios asignados: &nbsp;
                                {user.asign && !!user.asign.length &&
                                    user.asign.map((asign: number) => (
                                        <span key={asign} className={'d-inline-block'}>
                                            {asign} &nbsp;
                                        </span>
                                    ))
                                }
                                {(!user.asign || !user.asign.length) &&
                                    <span> ninguno </span>
                                }
                            </Card.Text>


                            <Button className={'col-12 m-2'}
                                variant={'primary'}
                                style={{ marginTop: '10px' }}
                                onClick={() => setAsignVisible(!asignVisible)}
                            >
                                CAMBIAR ASIGNACIONES
                            </Button>

                            <div style={{
                                display: asignVisible ? 'block' : 'none',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <div style={{ marginTop: '12px' }}>
                                    <input type={'number'}
                                        id={index.toString()}
                                        style={{ width: '60px' }}
                                        min={1}
                                        onChange={(event: any) => setAsig([user._id?.toString(), event.target.value])}
                                    />
                                    
                                    &nbsp;
                                    
                                    <Button onClick={() => assignTerritoryHandler(user._id?.toString(), false, index.toString())}>
                                        &nbsp; Asignar &nbsp;
                                    </Button>

                                </div>

                                <div style={{ marginTop: '12px' }}>
                                    <input type={'number'}
                                        id={index.toString() + "-b"}
                                        style={{ width: '60px' }}
                                        min={1}
                                        onChange={(event: any) => setDesasig([user._id?.toString(), event.target.value])}
                                    />
                                    &nbsp;
                                    <Button onClick={() => assignTerritoryHandler(user._id?.toString(), false, index.toString() + "-b")}>
                                        Desasignar
                                    </Button>
                                </div>

                                <div style={{ marginTop: '12px' }}>
                                    <Button onClick={() => assignTerritoryHandler(user._id?.toString(), true, null)}>
                                        Desasignar todos
                                    </Button>
                                </div>
                            </div>

                            <hr/>

                            <Card.Text style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
                                Grupo: {user.group} &nbsp;&nbsp;
                                <Button variant={'dark'} onClick={() => setGroupVisible(!groupVisible)}>
                                    CAMBIAR GRUPO
                                </Button>
                            </Card.Text>

                            <div style={{ width: '350px', margin: 'auto' }}>
                                <div style={{ display: groupVisible ? 'block' : 'none' }}>
                                    <Pagination size={'lg'} style={{ textAlign: 'center' }}>
                                        {items}
                                    </Pagination>
                                </div>
                            </div>
                        

                            <hr/>
                        

                            <Button className={'col-12 m-2'} variant={ user.estado ? 'danger' : 'primary' }
                                onClick={() => modifyUserHandler(user._id?.toString(), !user.estado, user.role, user.group)}>
                                
                                {user.estado ? "DESACTIVAR" : "ACTIVAR"}
                            
                            </Button>

                            <br/>

                            <Button className={'col-12 m-2'} variant={user.role === 1 ? 'danger' : 'primary'}
                                onClick = {() => modifyUserHandler(user._id?.toString(), user.estado, user.role === 1 ? 0 : 1, user.group)}
                            >

                                {user.role === 1 ? "QUITAR ADMIN" : "HACER ADMIN"}

                            </Button>

                            <br/>

                            <Button className={'col-12 m-2'} variant={'primary'}
                                onClick = {() => { setEmail(user.email); setShowConfirmAlert(true) }}
                            >

                                RESETEAR CONTRASEÑA

                            </Button>

                        </Card.Body>
                    </Card>
                )})
            }
        </div>
    </>
    )
}
