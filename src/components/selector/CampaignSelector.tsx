import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { H2, Loading } from '../commons'
import { TerritoryNumberBlock } from '.'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { askForANewCampaignPackService, getCampaignAssignmentsByUser } from '../../services'
import { typeAppDispatch, typeRootState } from '../../models'

export const CampaignSelector = () => {

    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [assignedPacks, setAssignedPacks] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [show, setShow] = useState<boolean>(true)

    const openConfirmModalHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Pedir un nuevo paquete de números?",
            message: "Se te asignará otro paquete de 50 números de inmediato",
            execution: askForANewCampaignPack
        }))
    }

    const askForANewCampaignPack = (): void => {
        askForANewCampaignPackService().then((success: boolean) => {
            if (!success) return dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "",
                execution: () => window.location.reload(),
                animation: 2
            }))
            window.location.reload()
        })
    }

    useEffect(() => {
        getCampaignAssignmentsByUser().then((campaignPacks: number[]|null) => {
            setIsLoading(false)
            if (campaignPacks && campaignPacks.length) setAssignedPacks(campaignPacks)
        })
    }, [])
    
    return (
        <>
            <H2 title={"CAMPAÑA CELULARES 2022"} />
            
            <button className={'btn btn-success w-100 mt-4'}
                onClick={() => setShow(true)}
            >
                {show ? "Paquetes asignados" : "Ver paquetes asignados"}
            </button>

            {isLoading ?
                <Loading mt={'60px'} />
            :
                <>
                    {show &&
                        <>
                            {assignedPacks?.length ?
                                <TerritoryNumberBlock
                                    classes={'btn-success'}
                                    territories={assignedPacks}
                                    url={'/celulares'}
                                />
                                :
                                <div style={{ marginTop: '60px' }}>
                                    <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                                        No hay paquetes asignados <br /> Para recibir uno, hacer click en este botón:
                                    </h3>

                                    <button
                                        className={`btn btn-success d-block m-auto my-4 py-3 px-4`}
                                        onClick={() => openConfirmModalHandler()}
                                    >
                                        <span> Pedir un nuevo paquete de teléfonos <br /> para la Campaña de Celulares 2022 </span>
                                    </button>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </>
    )
}
