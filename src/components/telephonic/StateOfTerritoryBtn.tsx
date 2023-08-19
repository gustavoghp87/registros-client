import { changeStateOfTerritoryService } from '../../services'
import { FC } from 'react'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'
import { NavigateFunction, useNavigate } from 'react-router'
import { typeRootState, typeTerritoryNumber } from '../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    isFinished: boolean
    openAlertModalHandler: (title: string, message: string, animation: number) => void
    territoryNumber: typeTerritoryNumber
}

export const StateOfTerritoryBtn: FC<propsType> = ({ isFinished, openAlertModalHandler, territoryNumber }) => {
    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch = useDispatch()
    const navigate: NavigateFunction = useNavigate()
    
    const openConfirmModalHandler = (modal: number) => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: modal === 1 ? "¿Confirmar abrir territorio?" : "¿Confirmar finalizar territorio?",
            message: modal === 1 ? `El territorio ${territoryNumber} se abrirá de nuevo` : `El territorio ${territoryNumber} se dará por terminado ${!user.isAdmin ? 'y se te desasignará' : '' }`,
            execution: modal === 1 ? openTerritoryHandler : closeTerritoryHandler
        }))
    }

    const closeTerritoryHandler = async (): Promise<void> => {
        if (!territoryNumber) return
        const success = await changeStateOfTerritoryService(territoryNumber, true)
        if (!success) return openAlertModalHandler("Algo falló", "", 2)
        navigate('/selector')
    }

    const openTerritoryHandler = async (): Promise<void> => {
        if (!territoryNumber) return
        dispatch(showLoadingModalReducer())
        const success: boolean = await changeStateOfTerritoryService(territoryNumber, false)
        dispatch(hideLoadingModalReducer())
        if (!success) openAlertModalHandler("Algo falló", "", 2)
        window.location.reload()
    }

    return (
        <>
            {isFinished ?
                <button
                    className={'btn btn-general-red d-block mx-auto py-2 mt-3 mb-5'}
                    onClick={() => openConfirmModalHandler(1)}
                    style={{ fontSize: '1.2rem' }}
                >
                    Desmarcar este territorio como terminado
                </button>
                :
                <button
                    className={'btn btn-general-blue d-block mx-auto py-2 mt-3 mb-5'}
                    onClick={() => openConfirmModalHandler(2)}
                    style={{ fontSize: '1.2rem' }}
                >
                    Marcar este territorio como terminado
                </button>
            }
        </>
    )
}
