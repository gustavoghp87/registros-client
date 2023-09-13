import { ConfigCreateHTHTerritories, ConfigSendInvitationNewCongregation, ConfigSetCongregationName, ConfigSetGoogleBoardUrl } from './config-subcomp'
import { goToTop, setDisableCloseHthFacesService, setDisableEditMapsService, setDisableHthFaceObservatiosService } from '../../services'
import { H2 } from '../commons'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const btnClasses = 'btn-size12 d-block mx-auto px-3 mt-5 mb-0'

const btnStyles = { width: '350px', minHeight: '80px' }

export const Config = () => {
    const config = useSelector((state: typeRootState) => state.config)
    const [showCreateHthTerritories, setShowCreateHthTerritories] = useState(false)
    const [showInvitationForNewCongregation, setShowInvitationForNewCongregation] = useState(false)
    const [showSetCongregationName, setShowSetCongregationName] = useState(false)
    const [showSetGoogleBoardUrl, setShowSetGoogleBoardUrl] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const setDisableEditHthMapsHandler = async () => {
        dispatch(showLoadingModalReducer())
        const success = await setDisableEditMapsService(!config.isDisabledEditHthMaps)
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
        const success = await setDisableCloseHthFacesService(!config.isDisabledCloseHthFaces)
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
        const success = await setDisableHthFaceObservatiosService(!config.isDisabledHthFaceObservations)
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

    useEffect(() => goToTop(), [])

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

            <button className={`btn ${config.isDisabledEditHthMaps ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableEditHthMapsHandler()}
            >
                {config.isDisabledEditHthMaps ? "Habilitar edición de Mapas (Casa en Casa)" : "Deshabilitar edición de Mapas (Casa en Casa)"}
            </button>

            <button className={`btn ${config.isDisabledCloseHthFaces ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableCloseHthFacesHandler()}
            >
                {config.isDisabledCloseHthFaces ?
                    "Habilitar función de cerrar Caras (Casa en Casa)"
                    :
                    "Deshabilitar función de cerrar Caras (Casa en Casa)"
                }
            </button>

            <button className={`btn ${config.isDisabledHthFaceObservations ? 'btn-general-red' : 'btn-general-blue'} ${btnClasses}`}
                style={btnStyles}
                onClick={() => setDisableHthFaceObservatiosHandler()}
            >
                {config.isDisabledHthFaceObservations ?
                    "Habilitar función de Observaciones de Caras (Casa en Casa)"
                    :
                    "Deshabilitar función de Observaciones de Caras (Casa en Casa)"
                }
            </button>

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

            {/* <h5 className={isDarkMode ? 'text-white' : ''}> Establecer localidad </h5>

            <h5 className={isDarkMode ? 'text-white' : ''}> Duración de cookie de acceso: 3 meses </h5> */}
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
