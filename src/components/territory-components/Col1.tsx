import { Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { typeHousehold } from '../../models/territory'

export const Col1 = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const household: typeHousehold = props?.household
    const showGoogleMapHandler: Function = props.showGoogleMapHandler

    return (

        <Col xs={12} md={2} style={{ margin: isMobile ? '20px auto' : 'auto' }}>

            {household && household.direccion && <>
                <h4 className={'text-center mt-2'} style={{ fontSize: isMobile ? '1.1rem' : '1.3rem' }}>

                    Territorio {household?.territorio}
                    <br/>
                    Manzana {household?.manzana}
                    <br/>
                    Vivienda {household?.inner_id}

                </h4>

                <button className={'btn btn-general-blue d-block mx-auto mt-3'} onClick={() => showGoogleMapHandler(household?.direccion)}>
                    Ver en el Mapa
                </button>

            </>}
        </Col>

    )
}
