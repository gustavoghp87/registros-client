import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Pagination } from 'react-bootstrap'
import { BsArrowBarDown, BsArrowBarUp } from 'react-icons/bs'
import { Socket } from 'socket.io-client'
import { assignTerritoryService, changePswOtherUserService, editUserService, getUserByTokenService } from '../../services/userServices'
import { refreshUserReducer, setValuesAndOpenAlertModalReducer, typeMode } from '../../store'
import { typeAppDispatch, typeRootState, typeUser, userChangeString } from '../../models'

export const UsersCard = (props: any) => {

    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const currentUser: typeUser = props.user
    const setIsLoading: Function = props.setIsLoading
    const socket: Socket = props.socket
    const assignInput = useRef<any>()
    const unassignInput = useRef<any>()
    const [asig, setAsig] = useState<string[]>([])
    const [asignVisible, setAsignVisible] = useState<boolean>(false)
    const [desasig, setDesasig] = useState<string[]>([])
    const [groupVisible, setGroupVisible] = useState<boolean>(false)
    const [showCardBody, setShowCardBody] = useState<boolean>(false)
    const groups: number[] = [1,2,3,4,5,6]
    let email: string = ""

    const openAlertModalHandler = (mode: typeMode, title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode,
            title,
            message,
            execution
        }))
    }

    const editUserHandler = async (user_id: string, estado: boolean, role: number, group: number): Promise<void> => {
        setIsLoading(true)
        const updatedUser: typeUser|null = await editUserService(user_id, estado, role, group)
        setIsLoading(false)
        if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al modificar usuario")
        sendUpdatedUser(updatedUser)
        refreshMyUserHandler(user_id)
    }

    const assignTerritoryHandler = async (user_id: string, all: boolean): Promise<void> => {
        if (!user_id) return
        setIsLoading(true)
        let asignar = asig[0] === user_id && asig[1] ? parseInt(asig[1]) : null
        let desasignar = desasig[0] === user_id && desasig[1] ? parseInt(desasig[1]) : null
        const updatedUser: typeUser|null = await assignTerritoryService(user_id, asignar, desasignar, all)
        setIsLoading(false)
        if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al cambiar las asignaciones")
        sendUpdatedUser(updatedUser)
        refreshMyUserHandler(user_id)
        if (assignInput.current) (assignInput.current as HTMLInputElement).value = ""
        if (unassignInput.current) (unassignInput.current as HTMLInputElement).value = ""
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
        setIsLoading(true)
        const response = await changePswOtherUserService(email)
        setIsLoading(false)
        if (response && response.success && response.newPassword)
            openAlertModalHandler('alert', `Clave reseteada y enviada por email a ${email}`, `Nueva clave: ${response.newPassword}`)
        else if (response && response.newPassword && response.emailFailed)
            openAlertModalHandler('alert', "Se reseteó la contraseña pero falló el envío del email", `Nueva clave: ${response.newPassword}`)
        else
            openAlertModalHandler('alert', "Error", `Algo falló al resetear la contraseña de ${email}`)
    }

    return (
        <Card key={currentUser._id.toString()}
            className={isDarkMode ? 'bg-dark text-white' : ''}
            style={{
                backgroundColor: '#f6f6f8',
                margin: '60px auto 0 auto',
                width: isMobile ? '95%': '500px'
            }}
        >
            
            <Card.Body style={{ padding: `30px 30px ${showCardBody ? '30px' : '12px'} 30px` }}>

                <Card.Title
                    className={'pointer text-center'}
                    onClick={() => setShowCardBody(x => !x)}
                    style={{
                        padding: '20px',
                        fontSize: isMobile ? '1.3rem' : '1.8rem'
                    }}
                >
                    {currentUser.email}
                    <br />
                    {showCardBody ?
                        <BsArrowBarUp size={isMobile ? '2rem' : '2.4rem'} className={'mt-3'} />
                        :
                        <BsArrowBarDown size={isMobile ? '2rem' : '2.4rem'} className={'mt-3'} />
                    }
                </Card.Title>

                {showCardBody && <>

                    <hr/>

                    <Card.Text style={{ fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' }}>
                        Territorios asignados: &nbsp;
                        {currentUser.asign && !!currentUser.asign.length &&
                            currentUser.asign.map((asign: number) => (
                                <span key={asign} className={'d-inline-block'}>
                                    {asign} &nbsp;
                                </span>
                            ))
                        }
                        {(!currentUser.asign || !currentUser.asign.length) &&
                            <span> ninguno </span>
                        }
                    </Card.Text>


                    <button className={'col-12 btn btn-general-blue my-2'}
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
                            <input
                                min={1}
                                onChange={(event: any) => setAsig([currentUser._id.toString(), event.target.value])}
                                ref={assignInput}
                                style={{ width: '60px' }}
                                type={'number'}
                            />
                            
                            &nbsp;
                            
                            <button className={'btn btn-general-blue'}
                                onClick={() => assignTerritoryHandler(currentUser._id.toString(), false)}
                            >
                                &nbsp; Asignar &nbsp;
                            </button>

                        </div>

                        <div style={{ marginTop: '12px' }}>
                            <input
                                min={1}
                                onChange={(event: any) => setDesasig([currentUser._id.toString(), event.target.value])}
                                ref={unassignInput}
                                style={{ width: '60px' }}
                                type={'number'}
                            />
                            &nbsp;
                            <button className={'btn btn-general-blue'}
                                onClick={() => assignTerritoryHandler(currentUser._id.toString(), false)}
                            >
                                Desasignar
                            </button>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                            <button className={'btn btn-general-blue'}
                                onClick={() => assignTerritoryHandler(currentUser._id.toString(), true)}
                            >
                                Desasignar todos
                            </button>
                        </div>
                    </div>

                    <hr/>

                    <Card.Text className={'text-center mt-3'} style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                        Grupo: {currentUser.group} &nbsp;&nbsp;
                        <button className={'btn btn-general-blue'} onClick={() => setGroupVisible(!groupVisible)}>
                            CAMBIAR GRUPO
                        </button>
                    </Card.Text>

                    {groupVisible &&
                        <div className={'mx-auto my-4'}>
                            {isMobile ? <>
                                <Pagination className={'text-center d-flex justify-content-center mb-0'} size={'lg'}>
                                    {[1,2,3].map((groupNumber: number) =>
                                        <Pagination.Item key={groupNumber} className={''}
                                            active={groupNumber === currentUser.group}
                                            onClick={() => {
                                                editUserHandler(currentUser._id.toString(), currentUser.estado, currentUser.role, groupNumber)
                                            }}
                                        >
                                            {groupNumber}
                                        </Pagination.Item>
                                    )}
                                </Pagination>
                                <Pagination className={'text-center d-flex justify-content-center'} size={'lg'}>
                                    {[4,5,6].map((groupNumber: number) =>
                                        <Pagination.Item key={groupNumber} className={''}
                                            active={groupNumber === currentUser.group}
                                            onClick={() => {
                                                editUserHandler(currentUser._id.toString(), currentUser.estado, currentUser.role, groupNumber)
                                            }}
                                        >
                                            {groupNumber}
                                        </Pagination.Item>
                                    )}
                                </Pagination>
                            </>
                            :
                                <Pagination className={'text-center d-flex justify-content-center'} size={'lg'}>
                                    {groups.map((groupNumber: number) =>
                                        <Pagination.Item key={groupNumber} className={''}
                                            active={groupNumber === currentUser.group}
                                            onClick={() => {
                                                editUserHandler(currentUser._id.toString(), currentUser.estado, currentUser.role, groupNumber)
                                            }}
                                        >
                                            {groupNumber}
                                        </Pagination.Item>
                                    )}
                                </Pagination>
                            }
                        </div>
                    }
                

                    <hr/>
                

                    <button className={`col-12 btn btn ${currentUser.estado ? 'btn-general-red' : 'btn-general-blue'} my-2`}
                        onClick={() => editUserHandler(currentUser._id.toString(), !currentUser.estado, currentUser.role, currentUser.group)}
                    >
                        {currentUser.estado ? "DESACTIVAR" : "ACTIVAR"}
                    </button>

                    <br/>

                    <button className={`col-12 btn ${currentUser.role === 1 ? 'btn-general-red' : 'btn-general-blue'} my-2`}
                        onClick = {() => editUserHandler(currentUser._id.toString(), currentUser.estado, currentUser.role === 1 ? 0 : 1, currentUser.group)}
                    >
                        {currentUser.role === 1 ? "QUITAR ADMIN" : "HACER ADMIN"}
                    </button>

                    <br/>

                    <button className={'col-12 btn btn-general-blue my-2'}
                        onClick = {() => openConfirmModalHandler(currentUser.email)}
                    >
                        RESETEAR CONTRASEÑA
                    </button>
                    
                </>}
            </Card.Body>
        </Card>
    )
}
