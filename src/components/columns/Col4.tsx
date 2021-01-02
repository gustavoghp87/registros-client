import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { mobile } from '../_App'


export const Col4:any = (props:any) => {

    const { vivienda } = props

    return (

    <Col xs={12} md={2}>
        <Row style={{textAlign:'center', height:'100%'}}>

            <div style={{display:"block", margin: mobile ? '20px auto' : 'auto' }}>

                <h4 className="form-check-label" style={{fontSize: mobile ? '1.3rem' : '1.1rem', fontWeight:600}}>
                    Teléfono no abonado en servicio
                </h4>

                <input className="checkboxuno" type="checkbox"
                    checked={vivienda.noAbonado}
                    style={{marginTop:"0.5rem", padding:5, marginLeft:"0rem"}}
                    onClick={ () => props.cambiarEstado(
                        vivienda.inner_id, vivienda.estado, !vivienda.noAbonado
                    )}
                    onChange={() => {}}
                />

            </div>

        </Row>
    </Col>

    )
}
