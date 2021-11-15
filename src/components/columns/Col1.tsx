import { Col } from 'react-bootstrap'
import { isMobile } from '../../services/functions'

export const Col1 = (props:any) => {

    const { vivienda } = props

    return (

        <Col xs={12} md={2} style={{margin: isMobile ? '20px auto' : 'auto'}}>

            <h4 style={{textAlign:'center', fontSize: isMobile ? '1.1rem' : '1.3rem'}}>

                Territorio {vivienda.territorio}
                <br/>
                Manzana {vivienda.manzana}
                <br/>
                Vivienda {vivienda.inner_id}

            </h4>

        </Col>

    )
}
