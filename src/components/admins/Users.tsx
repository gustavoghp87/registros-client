import { BsArrowBarDown } from 'react-icons/bs'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { getUsersService } from '../../services'
import { H2, Loading, WarningToaster } from '../commons'
import { io, Socket } from 'socket.io-client'
import { SERVER } from '../../app-config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeRootState, typeUser } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { userChangeString } from '../../constants'
import { UsersCard, UsersNewUser, UsersSelector } from './users-subcomp'

const socket: Socket = io(SERVER, { withCredentials: true })

type propsType = {
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

export const Users: FC<propsType> = ({ setIsLoading }) => {
    const { isMobile, user } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [emailSearchInputText, setEmailSearchInputText] = useState("")
    const [selectedGroup, setSelectedGroup] = useState(0)
    const [showNewUser, setShowNewUser] = useState(false)
    const [users, setUsers] = useState<typeUser[]|null>(null)
    const [usersToShow, setUsersToShow] = useState<typeUser[]|null>(null)
    const dispatch = useDispatch()
    
    useEffect(() => {
        getUsersService().then((users0: typeUser[]|null) => {
            if (!users0) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode:'alert',
                    title: "Problemas",
                    message: "Algo falló al cargar los usuarios; refrescar",
                    animation: 2
                }))
                return
            }
            setUsers(users0)
        })
    }, [dispatch])

    useEffect(() => {
        socket.on(userChangeString, (updatedUser: typeUser) => {
            if (!updatedUser || updatedUser.congregation !== user.congregation) return
            setIsLoading(true)
            getUsersService().then(users => {
                setIsLoading(false)
                if (users) setUsers(users)
            })
        })
        return () => { socket.off(userChangeString) }
    }, [setIsLoading, user.congregation])

    useEffect(() => {
        (!users?.length || (!emailSearchInputText && !selectedGroup)) ?
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

        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-3'}
            style={{ width: '350px', minHeight: '60px' }}
            onClick={() => setShowNewUser(true)}
            disabled={showNewUser}
        >
            NUEVO USUARIO <BsArrowBarDown size={isMobile ? '2rem' : '1.4rem'} />
        </button>

        {showNewUser &&
            <UsersNewUser
                setIsLoading={setIsLoading}
                setShowNewUser={setShowNewUser}
            />
        }

        {!!users?.length && !showNewUser &&
            <UsersSelector
                selectedGroup={selectedGroup}
                setEmailSearchInputText={setEmailSearchInputText}
                setSelectedGroup={setSelectedGroup}
                usersToShow={usersToShow}
            />
        }

        {!showNewUser && !!usersToShow?.length && usersToShow.map(user =>
            <UsersCard
                key={user.id}
                currentUser={user}
                setIsLoading={setIsLoading}
                socket={socket}
            />
        )}
    </>)
}
