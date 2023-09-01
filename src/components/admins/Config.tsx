import { ConfigCreateHTHTerritories, ConfigSendInvitationNewCongregation, ConfigSetCongregationName, ConfigSetGoogleBoardUrl } from './config-subcomp'
import { goToTop } from '../../services'
import { H2 } from '../commons'
import { typeRootState } from '../../models'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const btnClasses = 'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-0'

const btnStyles = { width: '350px', minHeight: '60px' }

export const Config = () => {
    const config = useSelector((state: typeRootState) => state.config)
    const [showCreateHthTerritories, setShowCreateHthTerritories] = useState(false)
    const [showInvitationForNewCongregation, setShowInvitationForNewCongregation] = useState(false)
    const [showSetCongregationName, setShowSetCongregationName] = useState(false)
    const [showSetGoogleBoardUrl, setShowSetGoogleBoardUrl] = useState(false)
    const navigate = useNavigate()

    useEffect(() => goToTop(), [])

    return (<>
    
        <H2 title={'CONFIGURACIÓN DE LA APLICACIÓN'} mb={'80px'} />

        {!showCreateHthTerritories && !showInvitationForNewCongregation && !showSetCongregationName && !showSetGoogleBoardUrl && <>

            <button className={btnClasses} style={btnStyles} onClick={() => setShowSetCongregationName(true)}>
                {!!config.name ? "Cambiar el nombre de la Congregación" : "Cargar el nombre de la Congregación"}
            </button>

            {!!config.name && !config.numberOfTerritories &&
                <button className={btnClasses} style={btnStyles} onClick={() => setShowCreateHthTerritories(true)}>
                    Crear Territorios de Casa en Casa
                </button>
            }

            <button className={btnClasses} style={btnStyles} onClick={() => setShowSetGoogleBoardUrl(true)}>
                {!!config.googleBoardUrl ? "Modificar dirección de Tablero Google" : "Cargar dirección de Tablero Google"}
            </button>

            <button className={btnClasses} style={btnStyles} onClick={() => navigate('/gmail')}>
                Renovar credenciales de Gmail
            </button>

            {config.congregation === 1 &&
                <button className={btnClasses} style={btnStyles} onClick={() => setShowInvitationForNewCongregation(true)}>
                    Enviar invitación para Congregación nueva
                </button>
            }

            {/*<Container className='text-center mt-5'>
                <h1>En desarrollo:</h1>

                <h5 className={isDarkMode ? 'text-white' : ''}> Establecer localidad </h5>

                <h5 className={isDarkMode ? 'text-white' : ''}> Duración de cookie de acceso: 3 meses </h5>
            </Container> */}
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
