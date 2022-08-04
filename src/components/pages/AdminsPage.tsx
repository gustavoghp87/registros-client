import io, { Socket } from 'socket.io-client'
import { useState, useEffect } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Pagination, DropdownButton, ButtonGroup, Dropdown } from 'react-bootstrap'
import { H2, Loading, WarningToaster } from '../commons'
import { SERVER } from '../../config'
import { refreshUserReducer, setValuesAndOpenAlertModalReducer, typeMode } from '../../store'
import { assignTerritoryService, changePswOtherUserService, editUserService, getUserByTokenService, getUsersService } from '../../services/userServices'
import { typeAppDispatch, typeRootState, typeUser, userChangeString } from '../../models'

export const AdminsPage = () => {
    
    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [asig, setAsig] = useState<string[]>([])
    const [asignVisible, setAsignVisible] = useState<boolean>(false)
    const [desasig, setDesasig] = useState<string[]>([])
    const [groupVisible, setGroupVisible] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket>()
    const [users, setUsers] = useState<typeUser[]>()
    const [viendo, setViendo] = useState<string>("todos")
    let email: string = ""
    const groups: number[] = [1,2,3,4,5,6]

    const editUserHandler = async (user_id: string, estado: boolean, role: number, group: number): Promise<void> => {
        const updatedUser: typeUser|null = await editUserService(user_id, estado, role, group)
        if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al modificar usuario")
        sendUpdatedUser(updatedUser)
        refreshMyUserHandler(user_id)
    }

    const assignTerritoryHandler = (user_id: string, all: boolean, inputId: string | null): void => {
        const assignTerritory = async (user_id: string, asignar: number|null, desasignar: number|null, all: boolean) => {
            const updatedUser: typeUser|null = await assignTerritoryService(user_id, asignar, desasignar, all)
            if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al cambiar las asignaciones")
            sendUpdatedUser(updatedUser)
            refreshMyUserHandler(user_id)
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
        if (socket && socket.connected) socket.emit(userChangeString, updatedUser)
        else openAlertModalHandler('alert', "Error", "Se desconectó el actualizador; refrescar la página")
    }

    const refreshMyUserHandler = (user_id: string): void => {
        if (user && user._id === user_id) {
            getUserByTokenService().then((user0: typeUser|null) => user0 ? dispatch(refreshUserReducer(user)) : null)
        }
    }
    
    const openAlertModalHandler = (mode: typeMode, title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode,
            title,
            message,
            execution
        }))
    }
    
    const openConfirmModalHandler = (selectedEmail: string): void => {
        if (selectedEmail) email = selectedEmail
        else return
        openAlertModalHandler(
            'confirm',
            "¿Resetear clave?",
            `Esto reseteará la contraseña del usuario ${email}, cerrará su sesión si está abierta y le enviará un correo con la nueva contraseña`,
            resetPasswordHandler
        )
    }

    const resetPasswordHandler = async (): Promise<void> => {
        if (!email)
            return openAlertModalHandler('alert', "Algo falló", "Refrescar la página y volver a intentar")
        const response = await changePswOtherUserService(email)
        if (response && response.success && response.newPassword)
            openAlertModalHandler('alert', `Clave reseteada y enviada por email a ${email}`, `Nueva clave: ${response.newPassword}`)
        else if (response && response.newPassword && response.emailFailed)
            openAlertModalHandler('alert', "Se reseteó la contraseña pero falló el envío del email", `Nueva clave: ${response.newPassword}`)
        else
            openAlertModalHandler('alert', "Error", `Algo falló al resetear la contraseña de ${email}`)
    }

    useEffect(() => {
        getUsersService().then((users0: typeUser[]|null) => {
            if (users0) setUsers(users0)
        })
        document.getElementById('adminsPageDropdownBtn')?.classList.remove('btn-primary')
    }, [])

    useEffect(() => {
        const newSocket = io(SERVER, { withCredentials: true })
        newSocket.connect()
        newSocket.on(userChangeString, (updatedUser: typeUser) => {
            if (updatedUser) getUsersService().then((users: typeUser[]|null) => {
                if (users) setUsers(users)
            })
        })
        if (newSocket) setSocket(newSocket)
        return () => setSocket(undefined)
    }, [])

    return (<>
        <H2 title={"ADMINISTRADORES"} />

        <div style={{ marginTop: '30px', position: 'fixed', zIndex: 4 }}>
            {users && (!socket || !socket.connected) &&
                <WarningToaster
                    bodyText={"Refrescar la página y verificar que hay internet"}
                    headerText={<strong>Hay un problema de conexión</strong>}
                />
            }
        </div>

        <button className={'btn btn-general-red d-block mx-auto mt-5 mb-0'}
            onClick={() => navigate('/logs')}
            style={{ width: '227px' }}
        >
            Ir a Logs de la Aplicación
        </button>

        <button className={'btn btn-general-red d-block mx-auto mt-4 mb-5'}
            onClick={() => navigate('/celulares-admins')}
        >
            Ir a Campaña Celulares 2022
        </button>

        <hr style={{ color: isDarkMode ? 'white' : 'black' }} />

        <div className={'d-block mx-auto mt-5'}>

            {!users && <Loading />}

            {users && !!users.length &&
                <>
                    <h2 className={`text-center mb-3 ${isDarkMode ? 'text-white' : ''}`}> Viendo {viendo} </h2>
                
                    <DropdownButton
                        as={ButtonGroup}
                        className={'d-block mx-auto text-center'}
                        id={"adminsPageDropdownBtn"}
                        title={`Viendo ${viendo}`}
                    >
                        <Dropdown.Item eventKey={"0"} onClick={() => setViendo("todos")} active={viendo === "todos"}> Ver todos </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey={"1"} onClick={() => setViendo("Grupo 1")} active={viendo === "Grupo 1"}> Grupo 1 </Dropdown.Item>
                        <Dropdown.Item eventKey={"2"} onClick={() => setViendo("Grupo 2")} active={viendo === "Grupo 2"}> Grupo 2 </Dropdown.Item>
                        <Dropdown.Item eventKey={"3"} onClick={() => setViendo("Grupo 3")} active={viendo === "Grupo 3"}> Grupo 3 </Dropdown.Item>
                        <Dropdown.Item eventKey={"4"} onClick={() => setViendo("Grupo 4")} active={viendo === "Grupo 4"}> Grupo 4 </Dropdown.Item>
                        <Dropdown.Item eventKey={"5"} onClick={() => setViendo("Grupo 5")} active={viendo === "Grupo 5"}> Grupo 5 </Dropdown.Item>
                        <Dropdown.Item eventKey={"6"} onClick={() => setViendo("Grupo 6")} active={viendo === "Grupo 6"}> Grupo 6 </Dropdown.Item>
                    </DropdownButton>
                </>
            }

            {users && !!users.length && users.map((user: typeUser, index: number) => (
                <Card key={index} 
                    className={isDarkMode ? 'bg-dark text-white' : ''}
                    style={{
                        width: isMobile ? '95%': '500px',
                        margin: '30px auto 60px auto',
                        backgroundColor: '#f6f6f8',
                        display: viendo === 'todos' || (user && user.group && user.group.toString()) === viendo.slice(-1) ? '' : 'none'
                    }}>
                    
                    <Card.Body style={{ padding: '30px' }}>

                        <Card.Title style={{
                            textAlign: 'center',
                            padding: '20px',
                            fontSize: isMobile ? '1.3rem' : '1.8rem'
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


                        <button className={'col-12 btn btn-general-blue m-2'}
                            style={{ marginTop: '10px' }}
                            onClick={() => setAsignVisible(!asignVisible)}
                        >
                            CAMBIAR ASIGNACIONES
                        </button>

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
                                    onChange={(event: any) => setAsig([user._id.toString(), event.target.value])}
                                />
                                
                                &nbsp;
                                
                                <button className={'btn btn-general-blue'}
                                    onClick={() => assignTerritoryHandler(user._id.toString(), false, index.toString())}
                                >
                                    &nbsp; Asignar &nbsp;
                                </button>

                            </div>

                            <div style={{ marginTop: '12px' }}>
                                <input type={'number'}
                                    id={index.toString() + "-b"}
                                    style={{ width: '60px' }}
                                    min={1}
                                    onChange={(event: any) => setDesasig([user._id.toString(), event.target.value])}
                                />
                                &nbsp;
                                <button className={'btn btn-general-blue'}
                                    onClick={() => assignTerritoryHandler(user._id.toString(), false, index.toString() + "-b")}
                                >
                                    Desasignar
                                </button>
                            </div>

                            <div style={{ marginTop: '12px' }}>
                                <button className={'btn btn-general-blue'}
                                    onClick={() => assignTerritoryHandler(user._id.toString(), true, null)}
                                >
                                    Desasignar todos
                                </button>
                            </div>
                        </div>

                        <hr/>

                        <Card.Text className={'text-center mt-3'} style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                            Grupo: {user.group} &nbsp;&nbsp;
                            <button className={'btn btn-general-blue'} onClick={() => setGroupVisible(!groupVisible)}>
                                CAMBIAR GRUPO
                            </button>
                        </Card.Text>

                        {groupVisible &&
                            <div className={'mx-auto mt-4 mb-4'} style={{ width: '350px' }}>
                                <Pagination size={'lg'} style={{ textAlign: 'center' }}>
                                    {groups.map((groupNumber: number) =>
                                        <Pagination.Item key={groupNumber} className={''}
                                            active={groupNumber === user.group}
                                            onClick={() => {
                                                editUserHandler(user._id.toString(), user.estado, user.role, groupNumber)
                                            }}
                                        >
                                            {groupNumber}
                                        </Pagination.Item>
                                    )}
                                </Pagination>
                            </div>
                        }
                    

                        <hr/>
                    

                        <button className={`col-12 btn btn ${user.estado ? 'btn-general-red' : 'btn-general-blue'} m-2`}
                            onClick={() => editUserHandler(user._id.toString(), !user.estado, user.role, user.group)}
                        >
                            {user.estado ? "DESACTIVAR" : "ACTIVAR"}
                        </button>

                        <br/>

                        <button className={`col-12 btn ${user.role === 1 ? 'btn-general-red' : 'btn-general-blue'} m-2`}
                            onClick = {() => editUserHandler(user._id.toString(), user.estado, user.role === 1 ? 0 : 1, user.group)}
                        >
                            {user.role === 1 ? "QUITAR ADMIN" : "HACER ADMIN"}
                        </button>

                        <br/>

                        <button className={'col-12 btn btn-general-blue m-2'}
                            onClick = {() => openConfirmModalHandler(user.email)}
                        >
                            RESETEAR CONTRASEÑA
                        </button>

                    </Card.Body>
                </Card>
            ))}
        </div>
    </>)
}
