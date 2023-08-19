import { Col } from 'react-bootstrap'
import { FC } from 'react'
import { typeHousehold, typeRootState, typeTerritoryNumber } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    household: typeHousehold
    setAddressToShowInGoogleMaps: (address: string) => void
    territoryNumber: typeTerritoryNumber
}

export const Col1: FC<propsType> = ({ household, setAddressToShowInGoogleMaps, territoryNumber }) => {
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    return (

        <Col xs={12} md={2} style={{ margin: isMobile ? '20px auto' : 'auto' }}>

            {household && household.address && <>

                <h4 className={'text-center mt-2'} style={{ fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
                    Territorio {territoryNumber}
                    <br/>
                    Manzana {household.block}
                    <br/>
                    Vivienda {household.householdId}
                </h4>

                <button className={'btn btn-general-blue d-block mx-auto mt-3'}
                    onClick={() => setAddressToShowInGoogleMaps(`${household.street} ${household.streetNumber}`)}
                >
                    Ver en el Mapa
                </button>

            </>}
        </Col>

    )
}
