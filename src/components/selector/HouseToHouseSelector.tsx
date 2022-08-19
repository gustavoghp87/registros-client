import { useState } from 'react'
import { useSelector } from 'react-redux'
import { GeoLocationModal, H2 } from '../commons'
import { TerritoryNumberBlock } from '.'
import { typeRootState } from '../../models'

export const HouseToHouseSelector = () => {

    const { isMobile } = useSelector((state: typeRootState) => ({
        isMobile: state.mobileMode.isMobile
    }))
    const [showGeolocationModal, setShowGeolocationModal] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const territoriesAll: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56]

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
                    <button className={`btn btn-general-blue d-block mx-auto mt-4 ${isMobile ? 'w-75' : 'w-25'}`}
                        onClick={() => setShowGeolocationModal(true)}
                    >
                        Dónde Estoy
                    </button>
                    
                    <TerritoryNumberBlock
                        classes={'btn-general-blue animate__animated animate__rubberBand'}
                        territories={territoriesAll}
                        url={'/casa-en-casa'}
                    />
                </>
            }

            {showGeolocationModal &&
                <GeoLocationModal 
                    setShowGeolocationModalHandler={setShowGeolocationModalHandler}
                />
            }
            
            {!show && <><br/><br/><br/></>}

            <br/><br/><br/>
        </>
    )
}
