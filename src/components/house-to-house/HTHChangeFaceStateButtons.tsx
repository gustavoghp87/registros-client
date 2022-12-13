import { useDispatch } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { setHTHIsFinishedService } from '../../services'
import { typeAppDispatch, typeTerritoryNumber } from '../../models'

export const HTHChangeFaceStateButtons = (props: any) => {

    const refreshHTHTerritoryHandler: Function = props.refreshHTHTerritoryHandler
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()

    const closeEveryFaceHandler = () => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Cerrar caras",
            message: `Se van a dar por terminadas todas las caras del territorio ${territoryNumber}`,
            execution: closeEveryFace
        }))
    }

    const openEveryFaceHandler = () => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Abrir caras",
            message: `Se van a abrir todas las caras del territorio ${territoryNumber}`,
            execution: openEveryFace
        }))
    }

    const closeEveryFace = () => {
        setHTHIsFinishedService(territoryNumber, null, null, null, true, true).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudieron cerrar las caras del territorio ${territoryNumber}`,
                animation: 2
            }))
            refreshHTHTerritoryHandler()
        })
    }

    const openEveryFace = () => {
        setHTHIsFinishedService(territoryNumber, null, null, null, false, true).then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudieron abrir las caras del territorio ${territoryNumber}`,
                animation: 2
            }))
            refreshHTHTerritoryHandler()
        })
    }

    return (
        <div className={'text-center mt-4'}>
            <button className={'btn btn-dark me-1'} onClick={() => closeEveryFaceHandler()}>
                Cerrar todas las caras
            </button>
            <button className={'btn btn-dark ms-1'} onClick={() => openEveryFaceHandler()}>
                Abrir todas las caras
            </button>
        </div>
    )
}