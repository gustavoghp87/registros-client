import { FC } from 'react'
import { maskTheBlock, setHTHIsFinishedService } from '../../../services'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeHTHTerritory, typePolygon, typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryHTH: typeHTHTerritory
}

export const HTHSetIsFinishedButton: FC<propsType> = ({ currentFace, refreshHTHTerritoryHandler, territoryHTH }) => {
    const config = useSelector((state: typeRootState) => state.config)
    const dispatch = useDispatch()

    const openConfirmModalHTHIsFinishedHandler = (): void => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Cambiar estado de la Cara",
            message: currentFace.completionData?.isFinished ?
                `Desmarcar esta CARA ${currentFace.street} de MANZANA ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)} como terminada`
                :
                `Marcar esta CARA ${currentFace.street} de MANZANA ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)} como terminada`,
            execution: setHTHIsFinishedHandler
        }))
    }

    const setHTHIsFinishedHandler = async (): Promise<void> => {
        if (!currentFace || !territoryHTH?.map?.polygons) return
        setHTHIsFinishedService(territoryHTH.territoryNumber, currentFace.block, currentFace.face, currentFace.id, !currentFace.completionData?.isFinished).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${currentFace.completionData?.isFinished ? "abrir" : "cerrar"} la cara ${currentFace.street} de la manzana ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)} (territorio ${territoryHTH.territoryNumber})`,
                animation: 2
            }))
            refreshHTHTerritoryHandler()
        })
    }
    
    return (
        <button
            className={`btn ${currentFace.completionData?.isFinished ? 'btn-secondary' : 'btn-general-red'} btn-size12 mx-auto mt-5 py-3 w-100 d-none`}
            id={'setHTHIsFinishedButton'}
            onClick={() => openConfirmModalHTHIsFinishedHandler()}
            style={{ maxWidth: '500px' }}
        >
            {currentFace.completionData?.isFinished ?
                `Desmarcar cara ${currentFace.street} de Manzana ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)} como terminada`
                :
                `Marcar cara ${currentFace.street} de Manzana ${maskTheBlock(currentFace.block, config.usingLettersForBlocks)} como terminada`
            }
        </button>
    )
}
