import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HTHItemCard, HTHObservationsForm } from '../'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { deleteHTHObservationService } from '../../../services'
import { typeAppDispatch, typeObservation, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'

export const HTHObservationsItem = (props: any) => {

    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const closeShowAddFormHandler: Function = props.closeShowFormHandler
    const currentFace: typePolygon = props.currentFace
    const date: string = props.date
    const observation: typeObservation = props.observation
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
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
        deleteHTHObservationService(territoryNumber, currentFace.block, currentFace.face, observation.id).then((success: boolean) => {
            if (!success) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: 'Algo falló',
                    message: 'Refrescar la página e intentar otra vez',
                    animation: 2
                }))
                return
            }
            refreshHTHTerritoryHandler()
        })
    }

    const closeShowFormHandler = (): void => {
        setShowForm(false)
    }

    return (
        <>
            <HTHItemCard
                creatorId={observation.creatorId}
                date={observation.date}
                deleteHandler={deleteHandler}
                editHandler={editHandler}
                text={observation.text}
            />

            {/* edit observation form */}
            {user && (user.isAdmin || observation.creatorId === user.id) && showForm &&
                <HTHObservationsForm
                    closeShowFormHandler={closeShowFormHandler}
                    currentFace={currentFace}
                    date={date}
                    refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                    territoryNumber={territoryNumber}
                    // specific
                    editText={observation.text}
                    idEdit={observation.id}
                />
            }
        </>
    )
}
