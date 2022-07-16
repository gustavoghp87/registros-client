import { useDispatch } from 'react-redux'
import { HTHItemCard } from '../HTHCommon/HTHItemCard'
import { typeAppDispatch } from '../../../store/store'
import { setValuesAndOpenAlertModalReducer } from '../../../store/AlertModalSlice'
import { deleteHTHDoNotCallService } from '../../../services/houseToHouseServices'
import { typeDoNotCall, typePolygon } from '../../../models/houseToHouse'
import { typeTerritoryNumber } from '../../../models/territory'

export const HTHDoNotCallsItem = (props: any) => {

    const dispatch: typeAppDispatch = useDispatch()
    const currentFace: typePolygon = props.currentFace
    const doNotCall: typeDoNotCall = props.doNotCall
    const territory: typeTerritoryNumber = props.territory
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler

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
