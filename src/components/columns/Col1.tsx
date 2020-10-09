import React from 'react'
import { Col } from 'react-bootstrap'
import { mobile } from '../_App'


export const Col1:any = (props:any) => {

    const { vivienda } = props

    return (

        <Col style={{margin:'auto'}}>

            <h4 style={{textAlign:'center', fontSize: mobile ? '1.1rem' : '1.3rem'}}>

                Territorio {vivienda.territorio}
                <br/>
                Manzana {vivienda.manzana}
                <br/>
                Vivienda {vivienda.inner_id}

            </h4>

        </Col>

    )
}

