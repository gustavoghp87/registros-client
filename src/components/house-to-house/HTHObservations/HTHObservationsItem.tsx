import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../../../context/authContext'
import { typeFace, typeObservation } from '../../../models/houseToHouse'
import { typeBlock, typeTerritoryNumber } from '../../../models/territory'
import { typeUser } from '../../../models/user'
import { typeAppDispatch, typeRootState } from '../../../store/store'
import { HTHObservationsForm } from './HTHObservationsForm'
import { deleteHTHObservationService } from '../../../services/houseToHouseServices'
import { MdDelete, MdEdit } from 'react-icons/md'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { Col, Row } from 'react-bootstrap'

export const HTHObservationsItem = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const dispatch: typeAppDispatch = useDispatch()
    const territory: typeTerritoryNumber = props.territory
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const observation: typeObservation = props.observation
    const closeShowAddFormHandler: Function = props.closeShowFormHandler
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    
    const [showForm, setShowForm] = useState<boolean>(false)

    const editHandler = (): void => {
        closeShowAddFormHandler()
        setShowForm(true)
    }

    const deleteHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Eliminar Observación?',
            message: `Se va a eliminar esta observación de la Manzana ${observation.block} Cara ${observation.face}: "${observation.text}"`,
            execution: deleteConfirmedHandler
        }))
    }
    
    const deleteConfirmedHandler = (): void => {
        deleteHTHObservationService(observation.id, territory).then((success: boolean) => {
            if (success) {
                refreshDoNotCallHandler()
            } else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: 'Algo falló',
                    message: 'Refrescar la página e intentar otra vez'
                }))
            }
        })
    }

    const closeShowFormHandler = (): void => {
        setShowForm(false)
    }

    
    return (<>
        {isMobile ?
            <div className={`my-4 p-3 text-center bg-dark text-white`}
                style={{
                    border: isDarkMode ? '1px solid white' : '1px solid lightgray',
                    borderRadius: '7px'
                }}
            >

                <small> Fecha: {observation.date} </small>

                <h3 className={'mt-2'}>
                    {observation.text}
                </h3>

                {user && user.isAdmin && <>
                    <div className={'mt-3 mb-2 py-1'} style={{ border: '1px solid lightgray', borderRadius: '5px' }}
                        onClick={() => editHandler()}
                    >
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }}>
                            Editar &nbsp;
                        </h4>
                        <MdEdit className={'d-inline align-top'} size={'1.4rem'} style={{ cursor: 'pointer' }} />
                    </div>
                    <div className={'mt-1 mb-2 py-1'} style={{ border: '1px solid lightgray', borderRadius: '5px' }}
                        onClick={() => deleteHandler()}
                    >
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }}>
                            Eliminar &nbsp;
                        </h4>
                        <MdDelete className={'d-inline align-top'} size={'1.4rem'} style={{ cursor: 'pointer' }} />
                    </div>
                </>}
            </div>
        :
            <Row className={`mx-auto my-4 p-4 w-75 ${isDarkMode ? 'text-white' : ''}`}
                style={{ border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}
            >

                <Col sm={2} className={'d-flex align-items-center'}>
                    <small > Fecha: {observation.date} </small>
                </Col>

                <Col sm={user && user.isAdmin ? 5 : 10}>
                    <h2 className={'mr-2'}>
                        {observation.text}
                    </h2>
                </Col>

                {user && user.isAdmin && <>
                    <Col sm={5}>
                        <div>
                            <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => editHandler()}>
                                &nbsp; | &nbsp; Editar &nbsp;
                            </h4>
                            <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                onClick={() => editHandler()}
                            />
                            <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => deleteHandler()}>
                                &nbsp; | &nbsp; Eliminar &nbsp;
                            </h4>
                            <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                                onClick={() => deleteHandler()}
                            />
                        </div>
                    </Col>
                </>}

            </Row>
        }

        {showForm &&
            <HTHObservationsForm
                territory={territory}
                block={block}
                face={face}
                editText={observation.text}
                closeShowFormHandler={closeShowFormHandler}
                refreshDoNotCallHandler={refreshDoNotCallHandler}
                idEdit={observation.id}
            />
        }

    </>)
}
