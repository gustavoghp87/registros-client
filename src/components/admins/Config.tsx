import { ConfigCreateHTHTerritories, ConfigSendInvitationNewCongregation, ConfigSetCongregationName, ConfigSetGoogleBoardUrl } from './config-subcomp'
import { H2, Hr } from '../commons'
import { hideLoadingModalReducer, setConfigurationReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as services from '../../services'

const btnClasses = 'btn-size12 d-block mx-auto px-3 mt-5 mb-0'

const btnStyles = { width: '350px', minHeight: '80px' }

const rowStyles = { marginTop: '14px', width: '400px' }

export const Config = () => {
    const { config, isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [showCreateHthTerritories, setShowCreateHthTerritories] = useState(false)
    const [showInvitationForNewCongregation, setShowInvitationForNewCongregation] = useState(false)
    const [showSetCongregationName, setShowSetCongregationName] = useState(false)
    const [showSetGoogleBoardUrl, setShowSetGoogleBoardUrl] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const setDisableEditHthMapsHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await services.setDisableEditMapsService(!config.isDisabledEditHthMaps)
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${config.isDisabledEditHthMaps ? 'habilitar' : 'deshabilitar'} la edición de Mapas`,
                animation: 2
            }))
            return
        }
        window.location.reload()
    }

    const setDisableCloseHthFacesHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await services.setDisableCloseHthFacesService(!config.isDisabledCloseHthFaces)
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${config.isDisabledEditHthMaps ? 'habilitar' : 'deshabilitar'} la función de cerrar Caras`,
                animation: 2
            }))
            return
        }
        window.location.reload()
    }

    const setDisableHthFaceObservatiosHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await services.setDisableHthFaceObservatiosService(!config.isDisabledHthFaceObservations)
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${config.isDisabledEditHthMaps ? 'habilitar' : 'deshabilitar'} la función de Observaciones de Caras`,
                animation: 2
            }))
            return
        }
        window.location.reload()
    }

    const setDisableHthBuildingsForUnassignedUsersHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await services.setDisableHthBuildingsForUnassignedUsersService(!config.isDisabledHthBuildingsForUnassignedUsers)
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${config.isDisabledHthBuildingsForUnassignedUsers ? 'habilitar' : 'deshabilitar'} la predicación en edificios para usuarios no asignados`,
                animation: 2
            }))
            return
        }
        window.location.reload()
    }

    const setUsingLettesForBlocksHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await services.setUsingLettesForBlocksService(!config.usingLettersForBlocks)
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: `No se pudo ${config.usingLettersForBlocks ? 'deshabilitar' : 'habilitar'} el uso de letras para identificar las manzanas`,
                animation: 2
            }))
            return
        }
        window.location.reload()
    }

    const downloadBackupHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await services.downloadDbBackupService()
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "No se pudo generar un Backup de la base de datos. Ver los Logs.",
                animation: 2
            }))
        }
        dispatch(setConfigurationReducer({ ...config, dbBackupLastDate: services.getCurrentLocalDate() }))
    }

    useEffect(() => services.goToTop(), [])

    return (<>
    
        <H2 title={'CONFIGURACIÓN DE LA APLICACIÓN'} mb={'80px'} />

        {!showCreateHthTerritories && !showInvitationForNewCongregation && !showSetCongregationName && !showSetGoogleBoardUrl && <>

            <button className={`btn btn-general-blue ${btnClasses}`} style={btnStyles} onClick={() => setShowSetCongregationName(true)}>
                {!!config.name ? "Cambiar el nombre de la Congregación" : "Cargar el nombre de la Congregación"}
            </button>

            {!!config.name && !config.numberOfTerritories &&
                <button className={`btn btn-general-blue ${btnClasses}`} style={btnStyles} onClick={() => setShowCreateHthTerritories(true)}>
                    Crear Territorios de Casa en Casa
                </button>
            }

            <button className={`btn btn-general-blue ${btnClasses}`} style={btnStyles} onClick={() => setShowSetGoogleBoardUrl(true)}>
                {!!config.googleBoardUrl ? "Modificar dirección de Tablero Google" : "Cargar dirección de Tablero Google"}
            </button>

            <button className={`btn btn-general-blue ${btnClasses}`} style={btnStyles} onClick={downloadBackupHandler}>
                Generar y descargar una copia de seguridad de la base de datos (
                    {config.dbBackupLastDate ? `última: ${config.dbBackupLastDate}` : "nunca se hizo una"})
            </button>

            {/* <h5 className={isDarkMode ? 'text-white' : ''}> Establecer localidad </h5>

            <h5 className={isDarkMode ? 'text-white' : ''}> Duración de cookie de acceso: 3 meses </h5> */}

            {config.congregation === 1 && <>
                <button className={`btn btn-general-blue ${btnClasses}`}
                    style={btnStyles}
                    onClick={() => setShowInvitationForNewCongregation(true)}
                >
                    Enviar invitación para Congregación nueva
                </button>

                <button className={`btn btn-general-blue ${btnClasses}`}
                    style={btnStyles}
                    onClick={() => navigate('/gmail')}
                >
                    Renovar credenciales de Gmail
                </button>
            </>}

            <Hr classes={'mx-auto mt-5'} styles={{ maxWidth: isMobile ? '100%' : '70%' }} />

            <H2 title={'CASA EN CASA'} mt={'30px'} />

            <div className={'container mt-5'}>
                <div className={'d-flex justify-content-center'}>
                    <div className={'row '} style={rowStyles}>
                        <div className={'col-2'}>
                            <input type='checkbox'
                                className={'form-check-input checkbox-md'}
                                checked={!config.isDisabledEditHthMaps}
                                onChange={() => setDisableEditHthMapsHandler()}
                            />
                        </div>
                        <div className={'col-10 pt-1'}>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Habilitar edición de Mapas
                            </h5>
                        </div>
                    </div>
                </div>
                <div className={'d-flex justify-content-center'}>
                    <div className={'row'} style={rowStyles}>
                        <div className={'col-2'}>
                            <input type='checkbox'
                                className={'form-check-input checkbox-md'}
                                checked={!config.isDisabledCloseHthFaces}
                                onChange={() => setDisableCloseHthFacesHandler()}
                            />
                        </div>
                        <div className={'col-10 pt-1'}>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Habilitar función de cerrar Caras
                            </h5>
                        </div>
                    </div>
                </div>
                <div className={'d-flex justify-content-center'}>
                    <div className={'row'} style={rowStyles}>
                        <div className={'col-2'}>
                            <input type='checkbox'
                                className={'form-check-input checkbox-md'}
                                checked={!config.isDisabledHthFaceObservations}
                                onChange={() => setDisableHthFaceObservatiosHandler()}
                            />
                        </div>
                        <div className={'col-10'}>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Habilitar función de Observaciones de Caras
                            </h5>
                        </div>
                    </div>
                </div>
                <div className={'d-flex justify-content-center'}>
                    <div className={'row'} style={rowStyles}>
                        <div className={'col-2 pt-1'}>
                            <input type='checkbox'
                                className={'form-check-input checkbox-md'}
                                checked={!config.isDisabledHthBuildingsForUnassignedUsers}
                                onChange={() => setDisableHthBuildingsForUnassignedUsersHandler()}
                            />
                        </div>
                        <div className={'col-10'}>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Habilitar Edificios a usuarios no asignados ni compartidos por WhatsApp
                            </h5>
                        </div>
                    </div>
                </div>
                <div className={'d-flex justify-content-center'}>
                    <div className={'row'} style={rowStyles}>
                        <div className={'col-2 pt-1'}>
                            <input type='checkbox'
                                className={'form-check-input checkbox-md'}
                                checked={config.usingLettersForBlocks}
                                onChange={() => setUsingLettesForBlocksHandler()}
                            />
                        </div>
                        <div className={'col-10'}>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Usar letras para identificar las manzanas en vez de números
                            </h5>
                        </div>
                    </div>
                </div>
                {/* <div className={'d-flex justify-content-center'}>
                    <div className={'row'} style={rowStyles}>
                        <div className={'col-2 pt-1'}>
                            <select className={'custom-select bg-light py-3 px-4 h5'} size={2}
                                style={{ height: isMobile ? '330px' : '230px', overflow: 'hidden', width: isMobile ? '100%' : '330px' }}
                                // onClick={(e: any) => setPollValue(e.target.value)}
                                // onTouchStart={(e: any) => setPollValue(e.target.value)}
                            >
                                <option value={1}> 1 - Soy solo yo </option>
                            </select>
                        </div>
                        <div className={'col-10'}>
                            <h5 className={isDarkMode ? 'text-white' : ''}>
                                Cantidad de timbres que se liberan cada día
                            </h5>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* <button className={`btn ${config.isDisabledEditHthMaps ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableEditHthMapsHandler()}
            >
                {config.isDisabledEditHthMaps ? "Habilitar edición de Mapas" : "Deshabilitar edición de Mapas"}
            </button>

            <button className={`btn ${config.isDisabledCloseHthFaces ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableCloseHthFacesHandler()}
            >
                {config.isDisabledCloseHthFaces ?
                    "Habilitar función de cerrar Caras"
                    :
                    "Deshabilitar función de cerrar Caras"
                }
            </button>

            <button className={`btn ${config.isDisabledHthFaceObservations ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableHthFaceObservatiosHandler()}
            >
                {config.isDisabledHthFaceObservations ?
                    "Habilitar función de Observaciones de Caras"
                    :
                    "Deshabilitar función de Observaciones de Caras"
                }
            </button>

            <button className={`btn ${config.isDisabledHthBuildingsForUnassignedUsers ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableHthBuildingsForUnassignedUsersHandler()}
            >
                {config.isDisabledHthBuildingsForUnassignedUsers ?
                    "Habilitar Edificios a usuarios no asignados ni compartidos por WhatsApp"
                    :
                    "Deshabilitar Edificios a usuarios no asignados ni compartidos por WhatsApp"
                }
            </button>

            <button className={`btn ${config.usingLettersForBlocks ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setUsingLettesForBlocksHandler()}
            >
                {config.usingLettersForBlocks ?
                    "Usar números para identificar las manzanas y letras para las caras"
                    :
                    "Usar letras para identificar las manzanas y números para las caras"
                }
            </button> */}

        </>}

        {showCreateHthTerritories &&
            <ConfigCreateHTHTerritories
                setShowCreateHthTerritories={setShowCreateHthTerritories}
            />
        }

        {showSetCongregationName &&
            <ConfigSetCongregationName
                setShowSetCongregationName={setShowSetCongregationName}
            />
        }

        {showSetGoogleBoardUrl &&
            <ConfigSetGoogleBoardUrl
                setShowSetGoogleBoardUrl={setShowSetGoogleBoardUrl}
            />
        }

        {showInvitationForNewCongregation &&
            <ConfigSendInvitationNewCongregation
                setShowInvitationForNewCongregation={setShowInvitationForNewCongregation}
            />
        }

    </>)
}
