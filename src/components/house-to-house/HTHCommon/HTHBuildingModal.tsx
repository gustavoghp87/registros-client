import { BsTrash } from 'react-icons/bs'
import { deleteHTHBuildingService, getCurrentLocalDate, maskTheBlock, shareHTHBuildingForAMonthService } from '../../../services'
import { DOMAIN } from '../../../app-config'
import { FC, useMemo, useState } from 'react'
import { Hr, Loading } from '../../commons'
import { HTHBuildingModalComplex, HTHBuildingModalSimple } from '..'
import { Modal } from 'react-bootstrap'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeHTHBuilding, typePolygon, typeRootState, typeTerritoryNumber } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard'

type propsType = {
    closeBuildingModalHandler: () => void
    congregation: number
    currentBuilding: typeHTHBuilding
    currentFace: typePolygon
    refreshHTHTerritoryHandler: () => void
    territoryNumber: typeTerritoryNumber
}

export const HTHBuildingModal: FC<propsType> = ({
    closeBuildingModalHandler, congregation, currentBuilding, currentFace, refreshHTHTerritoryHandler, territoryNumber
}) => {
    const { config, isDarkMode, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const shareUrl = useMemo(() => {
        let currentUrl = `####  *TERRITORIO ${territoryNumber}*   ####\n*Fecha: ${getCurrentLocalDate()}*`
        currentUrl += "\n\n*EDIFICIO COMPARTIDO POR 30 DÍAS:*\n"
        currentUrl += `${currentFace.street} ${currentBuilding.streetNumber}${currentBuilding.streetNumber2 ? `/${currentBuilding.streetNumber2}` : ''}${currentBuilding.streetNumber3 ? `/${currentBuilding.streetNumber3}` : ''}`
        currentUrl += `\n\n`
        currentUrl += `${DOMAIN}/edificio/${config.congregation}/${territoryNumber}/${currentFace.block}/${currentFace.face}/${currentBuilding.streetNumber}`
        currentUrl += `\n\n`
        return currentUrl
    }, [config, currentBuilding, currentFace, territoryNumber])

    const deleteHTHBuildingHandler = () => {
        closeBuildingModalHandler()
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Eliminar Edificio?",
            message: `Se va a eliminar el edificio ${currentFace.street} ${currentBuilding.streetNumber}. Esta acción es irreversible.`,
            execution: async () => {
                const success = await deleteHTHBuildingService(territoryNumber, currentFace.block, currentFace.face, currentBuilding.streetNumber)
                if (!success) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Algo falló",
                        message: "No se pudo eliminar el edificio",
                        animation: 2
                    }))
                    return
                }
                refreshHTHTerritoryHandler()
            }
        }))
    }

    const shareForAMonth = async () => {
        const success = await shareHTHBuildingForAMonthService(territoryNumber, currentFace.block, currentFace.face, currentBuilding.streetNumber)
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "No se pudo habilitar el edificio para compartir",
                animation: 2
            }))
            return
        }
        refreshHTHTerritoryHandler()
        setCopiedToClipboard(true);
    }

    return (
        <Modal
            backdrop={'static'}
            backdropClassName={''}
            contentClassName={isDarkMode ? 'bg-secondary' : ''}
            keyboard={false}
            onHide={() => closeBuildingModalHandler ? closeBuildingModalHandler() : navigate('/')}
            show={true}
            size={'xl'}
        >
            <Modal.Header closeButton />

            <Modal.Body>
                <div className={'card my-4'}>

                    {isLoading ?
                        <Loading mt={'30px'} mb={'7px'} white={false} />
                        :
                        <button className={'btn btn-general-blue btn-size12 w-100 mx-auto mt-4 mb-2'}
                            onClick={() => closeBuildingModalHandler ? closeBuildingModalHandler() : navigate('/')}
                            style={{ maxWidth: '300px' }}
                        >
                            Cerrar
                        </button>
                    }

                    <Hr />

                    <h1 className={'bg-dark text-white text-center fw-bolder mt-3 mb-2 py-2'}
                        style={{ border: isDarkMode ? '' : '1px solid lightgray', fontSize: '1.6rem' }}
                    >
                        Edificio {currentFace.street} {currentBuilding.streetNumber}{currentBuilding.streetNumber2 ? `/${currentBuilding.streetNumber2}` : ''}{currentBuilding.streetNumber3 ? `/${currentBuilding.streetNumber3}` : ''}
                        {(user.isAdmin || currentBuilding.creatorId === user.id) &&
                            <>
                                &nbsp; &nbsp;
                                <BsTrash
                                    className={'pointer mb-1'}
                                    onClick={() => deleteHTHBuildingHandler()}
                                />
                            </>
                        }
                    </h1>

                    <Hr />

                    {currentBuilding.isComplex ?
                        <HTHBuildingModalComplex
                            closeBuildingModalHandler={closeBuildingModalHandler}
                            congregation={congregation}
                            currentBuilding={currentBuilding}
                            currentFace={currentFace}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            setIsLoading={setIsLoading}
                            territoryNumber={territoryNumber}
                        />
                        :
                        <HTHBuildingModalSimple
                            congregation={congregation}
                            currentBuilding={currentBuilding}
                            currentFace={currentFace}
                            refreshHTHTerritoryHandler={refreshHTHTerritoryHandler}
                            setIsLoading={setIsLoading}
                            territoryNumber={territoryNumber}
                        />
                    }

                    {isLoading ?
                        <Loading mb={'15px'} white={false} />
                        :
                        <>
                        <button className={'btn btn-general-blue btn-size12 w-100 mx-auto mt-1 mb-3'}
                            style={{ maxWidth: '300px' }}
                            onClick={() => closeBuildingModalHandler ? closeBuildingModalHandler() : navigate('/')}
                        >
                            Cerrar
                        </button>
                        {(user.isAdmin || user.isBuildingManager) &&
                            <CopyToClipboard text={shareUrl} onCopy={() => setCopiedToClipboard(true)}>
                                <button className={`btn btn-${copiedToClipboard ? 'general-red' : 'success'} btn-size12 w-100 mx-auto mb-4`}
                                    style={{ maxWidth: '300px' }}
                                    onClick={shareForAMonth}
                                >
                                    {copiedToClipboard ? 'Link copiado!' : 'Compartir por 30 días'}
                                </button>
                            </CopyToClipboard>
                        }
                        </>
                    }

                </div>
            </Modal.Body>
        </Modal>
    )
}
