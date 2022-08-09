import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { typeRootState, typeTerritoryNumber } from '../../models'

export const StaticMap = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const territoryNumber: typeTerritoryNumber = props.territoryNumber
    const [showMap, setShowMap] = useState<boolean>(false)

    return (
        <>
            <Button variant={'dark'}
                onClick={() => setShowMap(x => !x)}
                style={{ display: 'block', margin: '22px auto' }}
            >
                {showMap ? "Ocultar Mapa" : "Ver Mapa"}
            </Button>

            {showMap &&
                <img src={`/img/${territoryNumber}.jpg`}
                    alt={`Mapa del territorio ${territoryNumber}`}
                    className={'d-block'}
                    style={{
                        border: isDarkMode ? '1px solid white' : '1px solid black',
                        borderRadius: '8px',
                        height: 'auto',
                        margin: '30px auto 50px auto',
                        padding: isMobile ? '10px' : '20px',
                        width: isMobile ? '99%' : '40%'
                    }}
                />
            }
        </>
    )
}
