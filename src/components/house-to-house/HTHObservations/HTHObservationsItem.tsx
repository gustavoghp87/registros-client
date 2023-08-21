import { deleteHTHObservationService } from '../../../services'
import { FC, useState } from 'react'
import { HTHItemCard, HTHObservationsForm } from '../'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeObservation, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    closeShowAddFormHandler: () => void
    currentFace: typePolygon
    observation: typeObservation
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHObservationsItem: FC<propsType> = ({ closeShowAddFormHandler, currentFace, observation, refreshHTHTerritoryHandler, territoryNumber }) => {
    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch = useDispatch()
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
            {(user.isAdmin || observation.creatorId === user.id) && showForm &&
                <HTHObservationsForm
                    closeShowFormHandler={closeShowFormHandler}
                    currentFace={currentFace}
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
