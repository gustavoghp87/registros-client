import { deleteHTHDoNotCallService } from '../../../services'
import { FC } from 'react'
import { HTHItemCard } from '../'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeDoNotCall, typePolygon, typeTerritoryNumber } from '../../../models'
import { useDispatch } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    doNotCall: typeDoNotCall
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHDoNotCallsItem: FC<propsType> = ({ currentFace, doNotCall, refreshHTHTerritoryHandler, territoryNumber }) => {
    const dispatch = useDispatch()

    const deleteHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Eliminar No Tocar?',
            message: `Se va a eliminar este No Tocar de la Manzana ${currentFace.block} Cara ${currentFace.face}: ${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`,
            execution: deleteConfirmedHandler
        }))
    }

    const deleteConfirmedHandler = (): void => {
        deleteHTHDoNotCallService(territoryNumber, currentFace.block, currentFace.face, doNotCall.id).then((success: boolean) => {
            if (!success) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: 'Algo falló',
                    message: `No se pudo eliminar este No Tocar de la Manzana ${currentFace.block} Cara ${currentFace.face}: ${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`,
                    animation: 2
                }))
                return
            }
            refreshHTHTerritoryHandler()
        })
    }

    return (
        <HTHItemCard
            creatorId={doNotCall.creatorId}
            date={doNotCall.date}
            deleteHandler={deleteHandler}
            text={`${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`}
        />
    )
}
