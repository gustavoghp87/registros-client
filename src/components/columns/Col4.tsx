import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { mobile } from '../_App'


export const Col4:any = (props:any) => {

    const { vivienda } = props

    return (

    <Col>
        <Row style={{textAlign:'center', height:'100%'}}>

            <div style={{display:"block", margin: "auto" }}>

                <input className="form-check-input" type="checkbox"
                    checked={vivienda.noAbonado}
                    style={{marginTop:"0.5rem", transform:"scale(1.5)", padding:5, marginLeft:"0rem"}}
                    onClick={ () => props.cambiarEstado(
                        vivienda.inner_id, vivienda.estado, !vivienda.noAbonado
                    )}
                    onChange={() => {}}
                />

                <label className="form-check-label" htmlFor="defaultCheck1" style={{fontSize: mobile ? '1.3rem' : '1.1rem', fontWeight:600}}>
                    &nbsp; &nbsp; Teléfono no abonado en servicio
                </label>
                
            </div>

        </Row>
    </Col>

    )
}
