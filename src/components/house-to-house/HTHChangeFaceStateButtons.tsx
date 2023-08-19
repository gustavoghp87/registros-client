import { FC } from 'react'
import { setHTHIsFinishedService } from '../../services'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeTerritoryNumber } from '../../models'
import { useDispatch } from 'react-redux'

type propsType = {
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHChangeFaceStateButtons: FC<propsType> = ({ refreshHTHTerritoryHandler, territoryNumber }) => {
    const dispatch = useDispatch()

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
