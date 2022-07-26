import { useDispatch } from 'react-redux'
import { HTHItemCard } from '../'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { deleteHTHDoNotCallService } from '../../../services'
import { typeAppDispatch, typeDoNotCall, typePolygon, typeTerritoryNumber } from '../../../models'

export const HTHDoNotCallsItem = (props: any) => {

    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const currentFace: typePolygon = props.currentFace
    const doNotCall: typeDoNotCall = props.doNotCall
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territory: typeTerritoryNumber = props.territory

    const deleteHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: '¿Eliminar No Tocar?',
            message: `Se va a eliminar este No Tocar de la Manzana ${currentFace.block} Cara ${currentFace.face}: ${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`,
            execution: deleteConfirmedHandler
        }))
    }

    const deleteConfirmedHandler = (): void => {
        deleteHTHDoNotCallService(doNotCall.id, territory, currentFace.block, currentFace.face).then((success: boolean) => {
            console.log(success)
            if (success) {
                refreshHTHTerritoryHandler()
            } else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: 'Algo falló',
                    message: `No se pudo eliminar este No Tocar de la Manzana ${currentFace.block} Cara ${currentFace.face}: ${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`
                }))
            }
        })
    }

    return (
        <>
            <HTHItemCard
                date={doNotCall.date}
                deleteHandler={deleteHandler}
                text={`${currentFace.street} ${doNotCall.streetNumber} ${doNotCall.doorBell}`}
            />
        </>
    )
}
