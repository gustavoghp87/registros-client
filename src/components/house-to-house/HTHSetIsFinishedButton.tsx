import { useDispatch } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { setHTHIsFinishedService } from '../../services'
import { typeAppDispatch, typeHTHTerritory, typePolygon } from '../../models'

export const HTHSetIsFinishedButton = (props: any) => {

    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const currentFace: typePolygon = props.currentFace
    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryHTH: typeHTHTerritory = props.territoryHTH

    const openConfirmModalHTHIsFinishedHandler = (): void => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Cambiar estado de la Cara",
            message: currentFace.isFinished ? `Desmarcar esta CARA ${currentFace.face} de MANZANA ${currentFace.block} como terminada` : `Marcar esta CARA ${currentFace.face} de MANZANA ${currentFace.block} como terminada`,
            execution: setHTHIsFinishedHandler
        }))
    }

    const setHTHIsFinishedHandler = async (): Promise<void> => {
        if (!currentFace || !territoryHTH || !territoryHTH.map || !territoryHTH.map.polygons) return
        setHTHIsFinishedService(territoryHTH.territoryNumber, currentFace.block, currentFace.face, currentFace.id, !currentFace.isFinished).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${currentFace.isFinished ? "abrir" : "cerrar"} la cara ${currentFace.face} de la manzana ${currentFace.block} (territorio ${territoryHTH.territoryNumber})`,
                animation: 2
            }))
            refreshHTHTerritoryHandler()
        })
    }
    
    return (
        <button
            className={`btn ${currentFace.isFinished ? 'btn-secondary' : 'btn-general-red'} btn-size12 mx-auto mt-5 py-3 w-100 d-none`}
            id={'setHTHIsFinishedButton'}
            onClick={() => openConfirmModalHTHIsFinishedHandler()}
            style={{ maxWidth: '500px' }}
        >
            {currentFace.isFinished ?
                `Desmarcar Cara ${currentFace.face} de Manzana ${currentFace.block} como terminada`
                :
                `Marcar CARA ${currentFace.face} de Manzana ${currentFace.block} como terminada`
            }
        </button>
    )
}
