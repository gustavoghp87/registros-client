import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState, typeStateOfTerritory, typeTerritoryNumber } from '../../models'
import { markTerritoryAsFinishedService } from '../../services'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'

export const StateOfTerritoryBtn = (props: any) => {

    const { user } = useSelector((state: typeRootState) => ({
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const openAlertModalHandler: Function = props.openAlertModalHandler
    const stateOfTerritory: typeStateOfTerritory = props.stateOfTerritory
    const territory: typeTerritoryNumber = props.territory
    
    const openConfirmModalHandler = (modal: number) => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: modal === 1 ? "¿Confirmar abrir territorio?" : "¿Confirmar finalizar territorio?",
            message: modal === 1 ? `El territorio ${territory} se abrirá de nuevo` : `El territorio ${territory} se dará por terminado ${!user.isAdmin ? 'y se te desasignará' : '' }`,
            execution: modal === 1 ? openTerritoryHandler : closeTerritoryHandler
        }))
    }

    const closeTerritoryHandler = async (): Promise<void> => {
        if (!territory) return
        const success = await markTerritoryAsFinishedService(territory, true)
        if (!success) return openAlertModalHandler("Algo falló", "")
        navigate('/index')
    }

    const openTerritoryHandler = async (): Promise<void> => {
        if (!territory) return
        dispatch(showLoadingModalReducer())
        const success: boolean = await markTerritoryAsFinishedService(territory, false)
        dispatch(hideLoadingModalReducer())
        if (!success) openAlertModalHandler("Algo falló", "")
        window.location.reload()
    }

    return (
        <>
            {stateOfTerritory.isFinished ?
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
