import { Button } from 'react-bootstrap'
import { FC, useState } from 'react'
import { typeRootState, typeTerritoryNumber } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    mapId: string
    territoryNumber: typeTerritoryNumber
}

export const StaticMap: FC<propsType> = ({ mapId, territoryNumber }) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [showMap, setShowMap] = useState(false)

    return (
        <>
            <Button variant={'dark'}
                onClick={() => setShowMap(x => !x)}
                style={{ display: 'block', margin: '22px auto' }}
            >
                {showMap ? "Ocultar Mapa" : "Ver Mapa"}
            </Button>
            <img src={`https://drive.google.com/uc?export=view&id=${mapId}`}
                alt={`Mapa del territorio ${territoryNumber}`}
                className={showMap ? 'd-block' : 'd-none'}
                style={{
                    border: isDarkMode ? '1px solid white' : '1px solid black',
                    borderRadius: '8px',
                    height: 'auto',
                    margin: '30px auto 50px auto',
                    padding: isMobile ? '10px' : '20px',
                    width: isMobile ? '99%' : '40%'
                }}
            />
        </>
    )
}
