import { GeoLocationModal, H2 } from '../commons'
import { TerritoryNumberBlock } from '.'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'
import { useState } from 'react'

export const HouseToHouseSelector = () => {
    const { isDarkMode, isMobile, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile,
        user: state.user
    }))
    const [show, setShow] = useState<boolean>(false)
    const [showGeolocationModal, setShowGeolocationModal] = useState<boolean>(false)

    const setShowGeolocationModalHandler = (): void => setShowGeolocationModal(false)
    
    return (
        <>
            <H2 title={"CASA EN CASA"} />

            <button className={`btn btn-general-blue w-100 mt-4`}
                onClick={() => setShow(x => !x)}
            >
                {show === true ? 'Ocultar' : 'Ver territorios'}
            </button>

            {show &&
                <>
                    {false &&
                        <button className={`btn btn-general-blue d-block mx-auto my-4 ${isMobile ? 'w-75' : 'w-25'}`}
                            onClick={() => setShowGeolocationModal(true)}
                        >
                            Dónde Estoy
                        </button>
                    }
                    
                    {!!user.hthAssignments.length ?
                        <TerritoryNumberBlock
                            classes={'btn-general-blue animate__animated animate__rubberBand'}
                            showForecast={true}
                            territories={[...user.hthAssignments].sort((a: number, b: number) => a - b)}
                            url={'/casa-en-casa'}
                        />
                        :
                        <h3 className={`text-center my-5 ${isDarkMode ? 'text-white' : ''}`} style={{ }}>
                            No hay territorios de Casa en Casa asignados <br /> Hablar con el grupo de territorios
                        </h3>
                    }
                </>
            }

            {showGeolocationModal &&
                <GeoLocationModal 
                    setShowGeolocationModalHandler={setShowGeolocationModalHandler}
                />
            }
            
            {!show && <><br/><br/><br/></>}

        </>
    )
}
