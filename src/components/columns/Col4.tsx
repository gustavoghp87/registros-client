import { Col, Row } from 'react-bootstrap'
import { isMobile } from '../../services/functions'

export const Col4 = (props:any) => {

    const { vivienda } = props

    return (
        <Col xs={12} md={2}>
            <Row style={{textAlign:'center', height:'100%'}}>

                <div style={{display:"block", margin: isMobile ? '20px auto' : 'auto' }}>

                    <h4 className="form-check-label" style={{fontSize: isMobile ? '1.3rem' : '1.1rem', fontWeight:600}}>
                        No abonado en servicio
                    </h4>

                    <input className="checkboxuno" type="checkbox"
                        checked={vivienda.noAbonado}
                        style={{marginTop:"0.5rem", padding:5, marginLeft:"0rem"}}
                        onClick={() => props.cambiarEstado(vivienda.inner_id, vivienda.estado, !vivienda.noAbonado, vivienda.asignado)}
                        onChange={() => {}}
                    />

                    <hr/>

                    <h4 className="form-check-label" style={{fontSize: isMobile ? '1.3rem' : '1.1rem', fontWeight:600}}>
                        Asignado {vivienda.asignado}
                    </h4>

                    <input className="checkboxuno" type="checkbox"
                        checked={vivienda.asignado}
                        style={{marginTop:"0.5rem", padding:5, marginLeft:"0rem"}}
                        onClick={() => props.cambiarEstado(
                            vivienda.inner_id, vivienda.estado, vivienda.noAbonado, !vivienda.asignado
                        )}
                        onChange={() => {}}
                    />

                </div>

            </Row>
        </Col>
    )
}
