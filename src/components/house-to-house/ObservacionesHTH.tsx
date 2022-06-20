import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../../context/authContext'
import { typeFace, typeObservation } from '../../models/houseToHouse'
import { typeBlock, typeTerritoryNumber } from '../../models/territory'
import { typeUser } from '../../models/user'
import { typeAppDispatch, typeRootState } from '../../store/store'
import { generalBlue } from '../_App'
import { ObservacionesHTHForm } from './ObservacionesHTHForm'
import { deleteHTHObservationService, editHTHObservationService } from '../../services/houseToHouseServices'
import { MdDelete, MdEdit } from 'react-icons/md'
import { setValuesAndOpenAlertModalReducer } from '../../store/AlertModalSlice'

export const ObservacionesHTH = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const territory: typeTerritoryNumber = props.territory
    const street: string = props.street
    const block: typeBlock = props.block
    const face: typeFace = props.face
    const observations: typeObservation[] = props.observations ? props.observations
        .filter((observation: typeObservation) => observation.block === block && observation.face === face).reverse() : []
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler

    const [showForm, setShowForm] = useState<boolean>(false)
    


    const closeShowFormHandler = (): void => {
        setShowForm(false)
    }

    return (
        <div style={{ marginTop: '100px', marginBottom: '50px' }}>
            
            <h1 className={'pt-3 text-center text-white d-block mx-auto'}
                style={{ backgroundColor: generalBlue, minHeight: '80px', width: '80%' }}
            >
                {observations && !!observations.length ?
                    'Observaciones:'
                    :
                    'No hay Observaciones en esta cara'}
            </h1>

            {observations && !!observations.length && observations.map((observation: typeObservation, index: number) => (
                <div key={index}>
                    <ObservacionesHTHItem
                        territory={territory}
                        block={block}
                        face={face}
                        observation={observation}
                        closeShowFormHandler={closeShowFormHandler}
                        refreshDoNotCallHandler={refreshDoNotCallHandler}
                    />
                </div>
            ))}

            <button className={'btn btn-general-blue d-block mx-auto'}
                style={{ marginTop: '50px' }}
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Ocultar' : 'Agregar Observación'}
            </button>

            {showForm && user && user.isAdmin &&
                <ObservacionesHTHForm
                    territory={territory}
                    block={block}
                    face={face}
                    closeShowFormHandler={closeShowFormHandler}
                    refreshDoNotCallHandler={refreshDoNotCallHandler}
                />
            }

        </div>
    )
}

const ObservacionesHTHItem = (props: any) => {

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

    const editConfirmedHandler = () => {
        editHTHObservationService(observation, territory)
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
            <div className={`my-4 p-3 text-center ${isDarkMode ? 'text-white' : ''}`}
                style={{ border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}
            >
                <div>
                    <h2 className={'mr-2'}>
                        {observation.text}
                    </h2>
                </div>

                <small className={'text-muted'}> Fecha: {observation.date} </small>

                {user && user.isAdmin && <>
                    <div>
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => editHandler()}>
                            Editar &nbsp;
                        </h4>
                        <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                            onClick={() => editHandler()}
                        />
                    </div>
                    <div>
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => deleteHandler()}>
                            Eliminar &nbsp;
                        </h4>
                        <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                            onClick={() => deleteHandler()}
                        />
                    </div>
                </>}
            </div>
        :
            <div className={`my-4 p-3 d-block mx-auto w-75 d-flex align-items-center justify-content-center ${isDarkMode ? 'text-white' : ''}`}
                style={{ border: isDarkMode ? '1px solid white' : '1px solid lightgray', borderRadius: '7px' }}
            >
                <h2 className={'mr-2'}>
                    {observation.text}
                </h2>

                <small className={'text-muted'}> Fecha: {observation.date} </small>

                {user && user.isAdmin && <>
                    <div>
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => editHandler()}>
                        &nbsp; | &nbsp; Editar &nbsp;
                        </h4>
                        <MdEdit className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                            onClick={() => editHandler()}
                        />
                    </div>
                    <div>
                        <h4 className={'d-inline'} style={{ cursor: 'pointer' }} onClick={() => deleteHandler()}>
                            &nbsp; | &nbsp; Eliminar &nbsp;
                        </h4>
                        <MdDelete className={'d-inline align-top'} size={'1.7rem'} style={{ cursor: 'pointer' }}
                            onClick={() => deleteHandler()}
                        />
                    </div>
                </>}
            </div>
        }

        {showForm &&
            <ObservacionesHTHForm
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
