import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { deleteHTHPolygonFaceService } from '../../services'
import { typeAppDispatch, typeHTHTerritory, typePolygon } from '../../models'

export const HTHDeleteFaceButton = (props: any) => {

    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH

    const openConfirmModalHTHDeleteFaceHandler = (): void => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Eliminar cara?",
            message: `Se va a eliminar esta CARA ${currentFace.face} de MANZANA ${currentFace.block}. Esta acción no tiene vuelta atrás.`,
            execution: deleteHTHFaceHandler
        }))
    }

    const deleteHTHFaceHandler = async (): Promise<void> => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        deleteHTHPolygonFaceService(territoryHTH.territoryNumber, currentFace.block, currentFace.face, currentFace.id).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo eliminar la cara ${currentFace.face} de la manzana ${currentFace.block} (territorio ${territoryHTH.territoryNumber})`,
                animation: 2
            }))
            refreshHTHTerritoryHandler()
        })
    }

    const isDisabled: boolean = useMemo(() => {
        return !!currentFace.buildings?.length || !!currentFace.doNotCalls?.length || !!currentFace.observations?.length
    }, [currentFace.buildings?.length, currentFace.doNotCalls?.length, currentFace.observations?.length])
    
    return (
        <button
            className={'btn btn-general-red btn-size12 d-block mx-auto py-3'}
            disabled={isDisabled}
            onClick={() => openConfirmModalHTHDeleteFaceHandler()}
            style={{ marginTop: '100px', width: '90%' }}
        >
            Eliminar Cara
        </button>
    )
}
