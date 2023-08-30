import { GeoLocationModal, H2 } from '../commons'
import { TerritoryNumberBlock } from '.'
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
    const [showAll, setShowAll] = useState(false)
    const [showGeolocationModal, setShowGeolocationModal] = useState(false)

    const setShowGeolocationModalHandler = (): void => setShowGeolocationModal(false)

    return (
        <>
            <H2 title={"CASA EN CASA"} />

            {showGeolocationModal &&
                <GeoLocationModal 
                    setShowGeolocationModalHandler={setShowGeolocationModalHandler}
                />
            }

            <button className={`btn btn-general-blue w-100 mt-4`}
                onClick={() => setShow(x => !x)}
            >
                {show === true ? 'Ocultar' : 'Ver territorios'}
            </button>

            {show && <>
                <button className={`btn btn-general-blue d-block mx-auto my-4 ${isMobile ? 'w-75' : 'w-25'}`}
                    onClick={() => setShowGeolocationModal(true)}
                >
                    Dónde Estoy
                </button>

                {user.isAdmin && user.hthAssignments?.length !== config.numberOfTerritories &&
                    <button className={`btn btn-general-blue d-block mx-auto mt-4 ${isMobile ? 'w-75' : 'w-25'}`}
                        onClick={() => setShowAll(x => !x)}
                    >
                        {showAll ? 'Ver solo los asignados' : 'Ver todos los territorios'}
                    </button>
                }

                {showAll ?
                    <TerritoryNumberBlock
                        classes={'btn-general-blue animate__animated animate__rubberBand'}
                        territories={Array.from({ length: config.numberOfTerritories }, (_: any, index: number) => index + 1)}
                        url={'/casa-en-casa'}
                        showForecast={true}
                    />
                    :
                    <>
                        {!!user.hthAssignments?.length ?
                            <TerritoryNumberBlock
                                classes={'btn-general-blue animate__animated animate__rubberBand'}
                                showForecast={true}
                                territories={[...user.hthAssignments].sort((a: number, b: number) => a - b)}
                                url={'/casa-en-casa'}
                            />
                            :
                            <h3 className={`text-center my-5 ${isDarkMode ? 'text-white' : ''}`}>
                                No hay territorios de Casa en Casa asignados <br /> Hablar con el grupo de territorios
                            </h3>
                        }
                    </>
                }
            </>}

            {!show && <><br/><br/><br/></>}

        </>
    )
}
