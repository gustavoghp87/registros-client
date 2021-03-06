import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { mobile } from '../_App'


export const Col2:any = (props:any) => {

    const { vivienda } = props

    return (

    <Col xs={12} md={4} style={{margin: mobile ? '0' : '20px 0px', padding: mobile ? '0' : '20px'}}>

        <Row style={{ paddingBottom: '10px' }}>
            <h4 style={{textAlign:'center', display:'block', margin:'auto', fontSize:'1.9rem'}}>
                Dirección:<br/>{vivienda.direccion}
            </h4>
        </Row>

        <Row style={{padding:'20px 0 1% 0'}}>
            
            <h4 style={{
                textAlign:'center',
                display: vivienda.noAbonado ? 'none' : 'block',
                margin:'auto',
                fontSize: mobile ? '2.3rem' : '2.1rem'
            }}>

                Teléfono:
                <div style={{marginTop:'7px'}}>
                    <a href={`tel:${vivienda.telefono}`}> {vivienda.telefono} </a>
                </div>

            </h4>

        </Row>

    </Col>

    )
}

