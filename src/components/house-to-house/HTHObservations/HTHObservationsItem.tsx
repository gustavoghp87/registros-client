import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { HTHObservationsForm } from './HTHObservationsForm'
import { HTHItemCard } from '../HTHCommon/HTHItemCard'
import { useAuth } from '../../../context/authContext'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { deleteHTHObservationService } from '../../../services'
import { typeAppDispatch, typeObservation, typePolygon, typeTerritoryNumber, typeUser } from '../../../models'

export const HTHObservationsItem = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const closeShowAddFormHandler: Function = props.closeShowFormHandler
    const currentFace: typePolygon = props.currentFace
    const date: string = props.date
    const observation: typeObservation = props.observation
    const refreshDoNotCallHandler: Function = props.refreshDoNotCallHandler
    const territory: typeTerritoryNumber = props.territory
    const [showForm, setShowForm] = useState<boolean>(false)

    const editHandler = (): void => {
        closeShowAddFormHandler()
        setShowForm(true)
    }

    const deleteHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Eliminar Observación?',
            message: `Se va a eliminar esta observación de la Manzana ${currentFace.block} Cara ${currentFace.face}: "${observation.text}"`,
            execution: deleteConfirmedHandler
        }))
    }
    
    const deleteConfirmedHandler = (): void => {
        deleteHTHObservationService(observation.id, territory, currentFace.block, currentFace.face).then((success: boolean) => {
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

    return (
        <>
            <HTHItemCard
                date={observation.date}
                deleteHandler={deleteHandler}
                editHandler={editHandler}
                text={observation.text}
            />

            {/* edit observation form */}
            {user && user.isAdmin && showForm &&
                <HTHObservationsForm
                    closeShowFormHandler={closeShowFormHandler}
                    currentFace={currentFace}
                    date={date}
                    refreshDoNotCallHandler={refreshDoNotCallHandler}
                    territory={territory}
                    // specific
                    editText={observation.text}
                    idEdit={observation.id}
                />
            }
        </>
    )
}