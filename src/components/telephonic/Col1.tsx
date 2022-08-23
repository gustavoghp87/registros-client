import { Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeHousehold, typeRootState, typeTerritoryNumber } from '../../models'

export const Col1 = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const household: typeHousehold = props.household
    const setAddressToShowInGoogleMaps: Function = props.setAddressToShowInGoogleMaps
    const territoryNumber: typeTerritoryNumber = props.territoryNumber

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
