import { Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { typeHousehold } from '../../models/territory'

export const Col1 = (props: any) => {

    const household: typeHousehold = props?.household
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    return (

        <Col xs={12} md={2} style={{ margin: isMobile ? '20px auto' : 'auto' }}>

            <h4 style={{ textAlign: 'center', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>

                Territorio {household?.territorio}
                <br/>
                Manzana {household?.manzana}
                <br/>
                Vivienda {household?.inner_id}

            </h4>

        </Col>

    )
}
