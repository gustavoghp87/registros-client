import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, DropdownButton, ButtonGroup, Dropdown, Form } from 'react-bootstrap'
import { io, Socket } from 'socket.io-client'
import { H2, Loading, WarningToaster } from '../commons'
import { UsersCard } from './'
import { SERVER } from '../../config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { getUsersService } from '../../services/userServices'
import { typeAppDispatch, typeRootState, typeUser, userChangeString } from '../../models'

const socket: Socket = io(SERVER, { withCredentials: true })

export const Users = (props: any) => {

    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const setIsLoading: Function = props.setIsLoading
    const [emailSearchInputText, setEmailSearchInputText] = useState<string>("")
    const [selectedGroup, setSelectedGroup] = useState<number>(0)
    const [users, setUsers] = useState<typeUser[]>()
    const [usersToShow, setUsersToShow] = useState<typeUser[]>()
    
    useEffect(() => {
        getUsersService().then((users0: typeUser[]|null) => {
            if (!users0) return dispatch(setValuesAndOpenAlertModalReducer({
                mode:'alert',
                title: "Problemas",
                message: "Algo falló al cargar los usuarios; refrescar",
                animation: 2
            }))
            setUsers(users0)
        })
        return () => {
            setUsers(undefined)
            setUsersToShow(undefined)
        }
    }, [dispatch])

    useEffect(() => {
        socket.on(userChangeString, (updatedUser: typeUser) => {
            if (!updatedUser || updatedUser.congregation !== user.congregation) return
            setIsLoading(true)
            getUsersService().then((users: typeUser[]|null) => {
                setIsLoading(false)
                if (users) setUsers(users)
            })
        })
        return () => { socket.off(userChangeString) }
    }, [setIsLoading, user.congregation])

    useEffect(() => {
        (!users || !users.length || (!emailSearchInputText && !selectedGroup)) ?
                setUsersToShow(users)
            :
                emailSearchInputText ?
                    selectedGroup ?
                        setUsersToShow(users.filter(x => x.group === selectedGroup && x.email.toLowerCase().includes(emailSearchInputText)))
                    :
                        setUsersToShow(users.filter(x => x.email.toLowerCase().includes(emailSearchInputText)))
                :
                    setUsersToShow(users.filter(x => x.group === selectedGroup))
    }, [emailSearchInputText, selectedGroup, users])

    return (
    <>
        <H2 title={"USUARIOS"} />
    
        {!users && <Loading mt={'50px'} />}
        
        {users && (!socket || !socket.connected) &&
            <div style={{ marginTop: '30px', position: 'fixed', zIndex: 4 }}>
                <WarningToaster
                    bodyText={"Refrescar la página y verificar que hay internet"}
                    headerText={<strong> Hay un problema de conexión </strong>}
                />
            </div>
        }

        {!!users?.length &&
            <Card
                className={`mx-auto text-center ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{ backgroundColor: '#f6f6f8', marginTop: '70px', maxWidth: '500px' }}
            >
                <Card.Body>
                    
                    <Card.Title className={'mt-4 mb-2'}> <h1>Mostrando {usersToShow?.length || 0} </h1> </Card.Title>

                    <div className={'row w-100 mx-0'}>
                        <div className={'col-sm-6'}>
                            <Card.Title className={'mt-4 mb-3'}> Buscar por correo: </Card.Title>

                            <Form.Control
                                autoFocus
                                className={'d-block mx-auto mb-4'}
                                onChange={(e: any) => setEmailSearchInputText(e.target.value?.toLowerCase() || "")}
                                placeholder={"Buscar por email"}
                                style={{ maxWidth: '300px' }}
                                type={'email'}
                            />
                        </div>

                        <div className={'col-sm-6'}>
                            <Card.Title className={'mt-4 mb-3'}> Buscar por grupo: </Card.Title>

                            <DropdownButton
                                as={ButtonGroup}
                                className={'d-block mx-auto text-center mb-4'}
                                id={"adminsPageDropdownBtn"}
                                title={`Viendo ${selectedGroup ? `Grupo ${selectedGroup}` : 'todos'}`}
                            >
                                <Dropdown.Item eventKey={"0"} onClick={() => setSelectedGroup(0)} active={selectedGroup === 0}> Ver todos </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item eventKey={"1"} onClick={() => setSelectedGroup(1)} active={selectedGroup === 1}> Grupo 1 </Dropdown.Item>
                                <Dropdown.Item eventKey={"2"} onClick={() => setSelectedGroup(2)} active={selectedGroup === 2}> Grupo 2 </Dropdown.Item>
                                <Dropdown.Item eventKey={"3"} onClick={() => setSelectedGroup(3)} active={selectedGroup === 3}> Grupo 3 </Dropdown.Item>
                                <Dropdown.Item eventKey={"4"} onClick={() => setSelectedGroup(4)} active={selectedGroup === 4}> Grupo 4 </Dropdown.Item>
                                <Dropdown.Item eventKey={"5"} onClick={() => setSelectedGroup(5)} active={selectedGroup === 5}> Grupo 5 </Dropdown.Item>
                                <Dropdown.Item eventKey={"6"} onClick={() => setSelectedGroup(6)} active={selectedGroup === 6}> Grupo 6 </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        }

        {usersToShow?.map((user: typeUser) => (
            <UsersCard
                key={user.id}
                setIsLoading={setIsLoading}
                socket={socket}
                user={user}
            />
        ))}
    </>)
}
