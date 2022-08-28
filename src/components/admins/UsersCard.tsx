import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Pagination } from 'react-bootstrap'
import { BsArrowBarDown, BsArrowBarUp } from 'react-icons/bs'
import { Socket } from 'socket.io-client'
import { Hr } from '../commons'
import { setValuesAndOpenAlertModalReducer, typeMode } from '../../store'
import { assignHTHTerritoryService, assignTLPTerritoryService, changePswOtherUserService, deleteUserService, editUserService } from '../../services/userServices'
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
    const [assignHTHValue, setAssignHTHValue] = useState<number>(0)
    const [assignTLPValue, setAssignTLPValue] = useState<number>(0)
    const [unassignHTHValue, setUnassignHTHValue] = useState<number>(0)
    const [unassignTLPValue, setUnassignTLPValue] = useState<number>(0)
    const [changeHTHAssignmentsVisible, setChangeHTHAssignmentsVisible] = useState<boolean>(false)
    const [changeTLPAssignmentsVisible, setChangeTLPAssignmentsVisible] = useState<boolean>(false)
    const [groupVisible, setGroupVisible] = useState<boolean>(false)
    const [showCardBody, setShowCardBody] = useState<boolean>(false)
    const groups: number[] = [1,2,3,4,5,6]

    const openAlertModalHandler = (mode: typeMode, title: string, message: string, animation?: number, execution?: Function): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode,
            title,
            message,
            execution,
            animation
        }))
    }

    const openResetPasswordConfirmModalHandler = (): void => {
        openAlertModalHandler(
            'confirm',
            "¿Resetear clave?",
            `Esto reseteará la contraseña del usuario ${currentUser.email}, cerrará su sesión si está abierta y le enviará un correo con la nueva contraseña`,
            undefined,
            resetPasswordHandler
        )
    }

    const openDeleteUserConfirmModalHandler = (): void => {
        openAlertModalHandler(
            'confirm',
            "¿Eliminar este usuario?",
            `Se eliminará el usuario ${currentUser.email} definitivamente`,
            undefined,
            deleteUserHandler
        )
    }

    const editUserHandler = async (email: string, isActive: boolean, role: number, group: number): Promise<void> => {
        setIsLoading(true)
        const updatedUser: typeUser|null = await editUserService(email, isActive, role, group)
        setIsLoading(false)
        if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al modificar usuario", 2)
        sendUpdatedUser(updatedUser)
    }

    const assignHTHTerritoryHandler = async (isToAssign: boolean, all: boolean): Promise<void> => {
        setIsLoading(true)
        let updatedUser: typeUser|null
        if (all) {
            updatedUser = await assignHTHTerritoryService(currentUser.email, null, null, true)
        } else if (isToAssign && assignHTHValue) {
            updatedUser = await assignHTHTerritoryService(currentUser.email, assignHTHValue, null, false)
        } else if (unassignHTHValue) {
            updatedUser = await assignHTHTerritoryService(currentUser.email, null, unassignHTHValue, false)
        } else {
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al cambiar las asignaciones", 2)
        sendUpdatedUser(updatedUser)
        setAssignHTHValue(0)
        setUnassignHTHValue(0)
    }

    const assignTLPTerritoryHandler = async (isToAssign: boolean, all: boolean): Promise<void> => {
        setIsLoading(true)
        let updatedUser: typeUser|null
        if (all) {
            updatedUser = await assignTLPTerritoryService(currentUser.email, null, null, true)
        } else if (isToAssign && assignTLPValue) {
            updatedUser = await assignTLPTerritoryService(currentUser.email, assignTLPValue, null, false)
        } else if (unassignTLPValue) {
            updatedUser = await assignTLPTerritoryService(currentUser.email, null, unassignTLPValue, false)
        } else {
            setIsLoading(false)
            return
        }
        setIsLoading(false)
        if (!updatedUser) return openAlertModalHandler('alert', "Error", "Algo falló al cambiar las asignaciones", 2)
        sendUpdatedUser(updatedUser)
        setAssignTLPValue(0)
        setUnassignTLPValue(0)
    }

    const sendUpdatedUser = (updatedUser: typeUser): void => {
        if (socket && socket.connected) socket.emit(userChangeString, updatedUser)
        else openAlertModalHandler('alert', "Error", "Se desconectó el actualizador; refrescar la página", 2)
    }

    const resetPasswordHandler = async (): Promise<void> => {
        setIsLoading(true)
        const response: [string, boolean]|null = await changePswOtherUserService(currentUser.email)
        setIsLoading(false)
        if (!response || !response[0])
            openAlertModalHandler('alert', "Error", `Algo falló al resetear la contraseña de ${currentUser.email}`, 2)
        else if (response[1])
            openAlertModalHandler('alert', `Clave reseteada y enviada por email a ${currentUser.email}`, `Nueva clave: ${response[0]}`, 1)
        else
            openAlertModalHandler('alert', "Se reseteó la contraseña pero falló el envío del email", `Nueva clave: ${response[0]}`)
    }

    const deleteUserHandler = async (): Promise<void> => {
        setIsLoading(true)
        deleteUserService(currentUser.id).then((success: boolean) => {
            setIsLoading(false)
            if (success) openAlertModalHandler(
                'alert',
                "Usuario eliminado",
                `Se eliminó al usuario ${currentUser.email}`,
                1
            )
            else openAlertModalHandler(
                'alert',
                "Algo falló",
                `No se pudo eliminar al usuario ${currentUser.email}`,
                2
            )
        })
    }

    const openHTHUnassignAllConfirmationModalHandler = () => openAlertModalHandler(
        'confirm',
        "¿Desasignar todos?",
        "Se van a desasignar todos los territorios de Casa en Casa de " + currentUser.email,
        undefined,
        unassignAllHTHHandler
    )

    const openTLPUnassignAllConfirmationModalHandler = () => openAlertModalHandler(
        'confirm',
        "¿Desasignar todos?",
        "Se van a desasignar todos los territorios de Telefónica de " + currentUser.email,
        undefined,
        unassignAllTLPHandler
    )

    const unassignAllHTHHandler = async (): Promise<void> => assignHTHTerritoryHandler(false, true)
    
    const unassignAllTLPHandler = async (): Promise<void> => assignTLPTerritoryHandler(false, true)

    return (
        <Card key={currentUser.email}
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

                    <Hr/>

                    <div style={{ fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' }}>
                        <h2> Casa en Casa </h2>
                        Territorios asignados: &nbsp;
                        {!!currentUser.hthAssignments?.length ?
                            currentUser.hthAssignments.sort((a: number, b: number) => a - b).map((territoryNumber: number) => (
                                <span key={territoryNumber} className={'d-inline-block'}>
                                    {territoryNumber} &nbsp;
                                </span>
                            ))
                            :
                            <span> ninguno </span>
                        }
                    </div>

                    <button className={'col-12 btn btn-general-blue mt-4 mb-2'}
                        onClick={() => setChangeHTHAssignmentsVisible(x => !x)}
                        style={{ marginTop: '10px' }}
                    >
                        CAMBIAR ASIGNACIONES
                    </button>

                    {changeHTHAssignmentsVisible &&
                        <div className={'text-center p-4'}>
                            <div style={{ marginTop: '12px' }}>
                                <input className={'form-control d-inline-block'}
                                    min={1}
                                    onChange={(e: any) => setAssignHTHValue(e.target.value)}
                                    style={{ width: '70px' }}
                                    type={'number'}
                                    value={assignHTHValue || ""}
                                />
                                &nbsp;&nbsp;
                                <button className={'btn btn-general-blue'}
                                    disabled={!assignHTHValue}
                                    onClick={() => assignHTHTerritoryHandler(true, false)}
                                    style={{ width: '102px' }}
                                >
                                    &nbsp; Asignar &nbsp;
                                </button>

                            </div>

                            <div style={{ marginTop: '12px' }}>
                                <input className={'form-control d-inline-block'}
                                    min={1}
                                    onChange={(e: any) => setUnassignHTHValue(e.target.value)}
                                    style={{ width: '70px' }}
                                    type={'number'}
                                    value={unassignHTHValue || ""}
                                />
                                &nbsp;&nbsp;
                                <button className={'btn btn-general-blue'}
                                    disabled={!unassignHTHValue}
                                    onClick={() => assignHTHTerritoryHandler(false, false)}
                                >
                                    Desasignar
                                </button>
                            </div>

                            {!!currentUser.hthAssignments?.length &&
                                <div style={{ marginTop: '22px' }}>
                                    <button className={'btn btn-general-blue'}
                                        onClick={() => openHTHUnassignAllConfirmationModalHandler()}
                                    >
                                        Desasignar todos
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    <Hr />

                    <div style={{ fontWeight: 500, fontSize: '1.2rem', textAlign: 'center' }}>
                        <h2> Telefónica </h2>
                        Territorios asignados: &nbsp;
                        {!!currentUser.phoneAssignments?.length ?
                            currentUser.phoneAssignments.sort((a: number, b: number) => a - b).map((territoryNumber: number) => (
                                <span key={territoryNumber} className={'d-inline-block'}>
                                    {territoryNumber} &nbsp;
                                </span>
                            ))
                            :
                            <span> ninguno </span>
                        }
                    </div>

                    <button className={'col-12 btn btn-general-blue mt-4 mb-2'}
                        onClick={() => setChangeTLPAssignmentsVisible(x => !x)}
                        style={{ marginTop: '10px' }}
                    >
                        CAMBIAR ASIGNACIONES
                    </button>

                    {changeTLPAssignmentsVisible &&
                        <div className={'text-center p-4'}>
                            <div style={{ marginTop: '12px' }}>
                                <input className={'form-control d-inline-block'}
                                    min={1}
                                    onChange={(e: any) => setAssignTLPValue(e.target.value)}
                                    style={{ width: '70px' }}
                                    type={'number'}
                                    value={assignTLPValue || ""}
                                />
                                &nbsp;&nbsp;
                                <button className={'btn btn-general-blue'}
                                    disabled={!assignTLPValue}
                                    onClick={() => assignTLPTerritoryHandler(true, false)}
                                    style={{ width: '102px' }}
                                >
                                    &nbsp; Asignar &nbsp;
                                </button>

                            </div>

                            <div style={{ marginTop: '12px' }}>
                                <input className={'form-control d-inline-block'}
                                    min={1}
                                    onChange={(e: any) => setUnassignTLPValue(e.target.value)}
                                    style={{ width: '70px' }}
                                    type={'number'}
                                    value={unassignTLPValue || ""}
                                />
                                &nbsp;&nbsp;
                                <button className={'btn btn-general-blue'}
                                    disabled={!unassignTLPValue}
                                    onClick={() => assignTLPTerritoryHandler(false, false)}
                                >
                                    Desasignar
                                </button>
                            </div>

                            {!!currentUser.phoneAssignments?.length &&
                                <div style={{ marginTop: '22px' }}>
                                    <button className={'btn btn-general-blue'}
                                        onClick={() => openTLPUnassignAllConfirmationModalHandler()}
                                    >
                                        Desasignar todos
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    <Hr />

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
                                                editUserHandler(currentUser.email, currentUser.isActive, currentUser.role, groupNumber)
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
                                                editUserHandler(currentUser.email, currentUser.isActive, currentUser.role, groupNumber)
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
                                                editUserHandler(currentUser.email, currentUser.isActive, currentUser.role, groupNumber)
                                            }}
                                        >
                                            {groupNumber}
                                        </Pagination.Item>
                                    )}
                                </Pagination>
                            }
                        </div>
                    }
                

                    <Hr />
                

                    <button className={`col-12 btn btn ${currentUser.isActive ? 'btn-general-red' : 'btn-general-blue'} my-2`}
                        onClick={() => editUserHandler(currentUser.email, !currentUser.isActive, currentUser.role, currentUser.group)}
                    >
                        {currentUser.isActive ? "DESACTIVAR" : "ACTIVAR"}
                    </button>

                    <br/>

                    <button className={`col-12 btn ${currentUser.role === 1 ? 'btn-general-red' : 'btn-general-blue'} my-2`}
                        onClick = {() => editUserHandler(currentUser.email, currentUser.isActive, currentUser.role === 1 ? 0 : 1, currentUser.group)}
                    >
                        {currentUser.role === 1 ? "QUITAR ADMIN" : "HACER ADMIN"}
                    </button>

                    <br/>

                    {user?.email !== currentUser.email &&
                        <button className={'col-12 btn btn-general-blue my-2'}
                            onClick = {() => openResetPasswordConfirmModalHandler()}
                        >
                            RESETEAR CONTRASEÑA
                        </button>
                    }

                    <button className={'col-12 btn btn-general-blue my-2'}
                        disabled={!!currentUser.isActive || currentUser.role !== 0 || !!currentUser.hthAssignments?.length
                     || !!currentUser.phoneAssignments?.length || !!currentUser.phoneAssignments?.length}
                        onClick = {() => openDeleteUserConfirmModalHandler()}
                    >
                        ELIMINAR USUARIO
                    </button>
                    
                </>}
            </Card.Body>
        </Card>
    )
}
