import { useState, useEffect } from 'react'
import { Card, Button, Pagination, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert'
import io from 'socket.io-client'
import { assignTerritoryService, modifyUserService, getUsersService, changePswOtherUserService } from '../services/userServices'
import { ReturnBtn } from './_Return'
import { Loading } from './_Loading'
import { SERVER } from '../config'
import { H2 } from './css/css'
import { isMobile } from '../services/functions'
import { typeUser } from '../models/typesUsuarios'

export const AdminsPage = (props: any) => {
    
    const [usersObj, setUsersObj] = useState<any>({ usuarios: [] })
    const [asignVisible, setAsignVisible] = useState(false)
    const [groupVisible, setGroupVisible] = useState(false)
    const [asig, setAsig] = useState<string[]>([])
    const [desasig, setDesasig] = useState<string[]>([])
    const [viendo, setViendo] = useState<string>("todos")
    const [socket, setSocket] = useState<any>(null)

    useEffect(() => {
        ;(async () => {
            const users: typeUser[]|null = await getUsersService()
            if (users) setUsersObj({ usuarios: users })
        })()

        if (socket) return
        const newSocket = io(SERVER, {
            withCredentials: true
            //extraHeaders: { "my-custom-header": "abcd" }
        })
        if (newSocket) setSocket(newSocket)
        
        if (newSocket) newSocket.on("user: change", (updatedUser: typeUser) => {
            ;(async () => {
                const users: typeUser[]|null = await getUsersService()
                if (users) setUsersObj({ usuarios: users })
            })()
        })
    }, [socket])
    

    const modifyUserHandler = async (user_id: string, estado: boolean, role: number, group: number): Promise<void> => {
        const updatedUser: typeUser|null = await modifyUserService(user_id, estado, role, group)
        if (updatedUser) sendUpdatedUser(updatedUser)
        else alert("Algo falló al modificar usuario")
    }

    const assignHandler = (user_id: string, all: boolean): void => {
        const assignTerritoryHandler = async (user_id: string, asignar: number|null, desasignar: number|null, all: boolean) => {
            const updatedUser: typeUser|null = await assignTerritoryService(user_id, asignar, desasignar, all)
            if (updatedUser) sendUpdatedUser(updatedUser)
            else alert("Algo falló al cambiar las asignaciones")
        }
        let asignar, desasignar
        if (asig[0] === user_id && asig[1]) asignar = parseInt(asig[1])
        if (desasig[0] === user_id && desasig[1]) desasignar = parseInt(desasig[1])
        if (asignar) assignTerritoryHandler(user_id, asignar, null, false)
        if (desasignar) assignTerritoryHandler(user_id, null, desasignar, false)
        if (all) assignTerritoryHandler(user_id, null, null, all)
        setAsig([])
        setDesasig([])
    }

    const sendUpdatedUser = (updatedUser: typeUser): void => {
        if (socket) socket.emit('user: change', updatedUser)
    }
    
    const resetPasswordHandler = (email: string): void => {
        confirmAlert({
            title: `¿Resetear clave?`,
            message: `Esto reseteará la contraseña del usuario ${email},
            cerrará su sesión si está abierta y le enviará un correo con la nueva contraseña`,
            buttons: [
                {
                    label: 'ACEPTAR',
                    onClick: () => resetPasswordHandler2()
                },
                {
                    label: 'CANCELAR',
                    onClick: () => {}
                }
            ]
        })

        const resetPasswordHandler2 = async (): Promise<void> => {
            const success: boolean = await changePswOtherUserService(email)
            if (success) alert(`Clave reseteada y enviada por email a ${email}`)
            else alert(`Algo falló al resetear la contraseña de ${email}`)
        }
    }

    return (
    <>
        {ReturnBtn(props)}

        <H2 style={{fontSize: isMobile ? '2.2rem' : ''}}> ADMINISTRADORES </H2>

        <div style={{display:'block', margin: isMobile ? '40px auto' : '80px auto'}}>

            {(!usersObj || !usersObj.usuarios.length) && <Loading />}

            {usersObj && usersObj.usuarios && usersObj.usuarios.length &&
            <>
                <h2 className="text-center mb-3"> Viendo {viendo} </h2>
                
                <DropdownButton
                    as={ButtonGroup}
                    key={'dropb'}
                    variant={'primary'}
                    title={`Viendo ${viendo}`}
                    style={{display:'block', margin:'auto', textAlign:'center'}}
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

            {usersObj && usersObj.usuarios && !!usersObj.usuarios &&
                usersObj.usuarios.map((usuario: typeUser, index: number) => {
                    
                    let active: number = usuario.group
                    let items: any[] = []
                    for (let number: number = 1; number <= 6; number++) {
                      items.push(
                        <Pagination.Item key={number}
                            active={number === active}
                            onClick={() => {
                                modifyUserHandler(usuario._id.toString(), usuario.estado, usuario.role, number)
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
                            display: viendo === 'todos' || usuario.group.toString() === viendo.slice(-1) ? '' : 'none'
                        }}>
                        
                        <Card.Body style={{padding:'30px'}}>

                            <Card.Title style={{
                                textAlign:'center',
                                padding:'20px',
                                fontSize: isMobile ? '1.5rem' : '1.8rem'
                            }}>
                                Usuario: <br/>
                                {usuario.email}

                            </Card.Title>


                            <hr/>


                            <Card.Text style={{fontWeight:500, fontSize:'1.2rem', textAlign:'center'}}>
                                Territorios asignados: &nbsp;
                                {usuario.asign && !!usuario.asign.length &&
                                    usuario.asign.map((asign: number) => (
                                        <span key={asign} className="d-inline-block">
                                            {asign} &nbsp;
                                        </span>
                                    ))
                                }
                            </Card.Text>


                            <Button block variant="primary"
                                style={{marginTop:'10px'}}
                                onClick={ () => setAsignVisible(!asignVisible) }
                            >
                                CAMBIAR ASIGNACIONES
                            </Button>

                            <div style={{
                                display: asignVisible ? 'block' : 'none',
                                padding: '20px',
                                textAlign: 'center'
                            }}>
                                <div style={{marginTop:'12px'}}>
                                    <input type="number"
                                        style={{width:'60px'}}
                                        min={1}
                                        onChange={event => setAsig([usuario._id.toString(), event.target.value])}
                                    />
                                    
                                    &nbsp;
                                    
                                    <Button onClick={
                                        () => assignHandler(usuario._id.toString(), false)
                                    }>
                                        &nbsp; Asignar &nbsp;
                                    </Button>

                                </div>

                                <div style={{marginTop:'12px'}}>
                                    <input type="number" name="" id="" style={{width:'60px'}} min={1}
                                        onChange={event => setDesasig([usuario._id.toString(), event.target.value])}
                                    />
                                    &nbsp;
                                    <Button onClick={() => assignHandler(usuario._id.toString(), false)}>
                                        Desasignar
                                    </Button>
                                </div>

                                <div style={{marginTop:'12px'}}>
                                    <Button onClick={() => assignHandler(usuario._id.toString(), true)}>
                                        Desasignar todos
                                    </Button>
                                </div>
                            </div>

                            <hr/>

                            <Card.Text style={{textAlign:'center', fontSize:'1.2rem', fontWeight:600}}>
                                Grupo: {usuario.group} &nbsp;&nbsp;
                                <Button variant="dark" onClick={() => setGroupVisible(!groupVisible)}>
                                    CAMBIAR GRUPO
                                </Button>
                            </Card.Text>

                            <div style={{ width: '350px', margin: 'auto'}}>
                                <div style={{ display: groupVisible ? 'block' : 'none'}}>

                                    <Pagination size="lg" style={{ textAlign: 'center' }}>
                                        {items}
                                    </Pagination>

                                </div>
                            </div>
                        

                            <hr/>
                        

                            <Button block variant={ usuario.estado ? 'danger' : 'primary' }
                                onClick={() => {usuario.estado === true 
                                    ?
                                    modifyUserHandler(usuario._id.toString(), false, usuario.role, usuario.group)
                                    :
                                    modifyUserHandler(usuario._id.toString(), true, usuario.role, usuario.group)
                                }}>
                                
                                {usuario.estado ? "DESACTIVAR" : "ACTIVAR"}
                            
                            </Button>

                            <br/>

                            <Button block variant={usuario.role === 1 ? 'danger' : 'primary'}
                                onClick = {
                                    () => {usuario.role === 1 
                                        ?
                                        modifyUserHandler(usuario._id.toString(), usuario.estado, 0, usuario.group)
                                        :
                                        modifyUserHandler(usuario._id.toString(), usuario.estado, 1, usuario.group)
                                    }
                                }
                            >

                                {usuario.role === 1 ? "QUITAR ADMIN" : "HACER ADMIN"}

                            </Button>

                            <br/>

                            <Button block variant={'primary'}
                                onClick = {() => resetPasswordHandler(usuario.email)}
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
