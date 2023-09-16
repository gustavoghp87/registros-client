import { GeoLocationModal, TerritoryNumberBlock } from '.'
import { H2 } from '../commons'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'
import { useState } from 'react'

export const HouseToHouseSelector = () => {
    const { config, isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [show, setShow] = useState(false)
    const [showAll, setShowAll] = useState(!user.hthAssignments?.length)
    const [showGeolocationModal, setShowGeolocationModal] = useState(false)

    return (<>

        <H2 title={"CASA EN CASA"} />

        {showGeolocationModal &&
            <GeoLocationModal 
                closeGeolocationModalHandler={() => setShowGeolocationModal(false)}
            />
        }

        <button className={`btn btn-general-blue w-100 mt-4`}
            onClick={() => setShow(x => !x)}
        >
            {show ? 'Ocultar' : 'Ver territorios'}
        </button>

        {show && <>
            <button className={`btn btn-general-blue d-block mx-auto my-4 ${isMobile ? 'w-75' : 'w-25'}`}
                onClick={() => setShowGeolocationModal(true)}
            >
                Dónde Estoy
            </button>

            {!!user.hthAssignments?.length && user.hthAssignments.length < config.numberOfTerritories &&
                <button className={`btn btn-general-blue d-block mx-auto mt-4 ${isMobile ? 'w-75' : 'w-25'}`}
                    onClick={() => setShowAll(x => !x)}
                >
                    {showAll ? 'Ver solo los asignados' : 'Ver todos los territorios'}
                </button>
            }

            {!!user.hthAssignments?.length ?
                <>
                    {user.hthAssignments.length === config.numberOfTerritories &&
                        <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                            Este usuario tiene asignados todos los territorios de Casa en Casa
                        </h3>
                    }
                </>
                :
                <h3 className={`text-center ${isDarkMode ? 'text-white' : ''}`}>
                    No hay territorios asignados de Casa en Casa
                </h3>
            }

            <TerritoryNumberBlock
                classes={'btn-general-blue animate__animated animate__rubberBand'}
                showForecast={true}
                territories={showAll ?
                    Array.from({ length: config.numberOfTerritories }, (_, index) => index + 1)
                    :
                    [...user.hthAssignments].sort((a, b) => a - b)
                }
                url={'/casa-en-casa'}
            />

        </>}

        {!show && <><br/><br/><br/></>}

    </>)
}
