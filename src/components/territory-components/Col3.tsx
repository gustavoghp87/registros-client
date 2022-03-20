import { Col, Row, Dropdown } from 'react-bootstrap'
import { isMobile, timeConverter } from '../../services/functions'
import { aDejarCarta, contesto, noContesto, noLlamar, noPredicado, typeHousehold } from '../../models/typesTerritorios'

export const Col3 = (props: any) => {

    const vivienda: typeHousehold = props?.vivienda
    const cambiarEstado: (inner_id: string, estado: string, noAbonado: boolean|null, asignado: boolean|undefined) => Promise<void> = props?.cambiarEstado
    const isDarkMode: string = props.isDarkMode

    return (
    
    <Col xs={12} md={3} style={{ margin: isMobile ? 'auto' : '0 30px' }}>

        <Row style={{ textAlign: 'center', height: '30%', margin: isMobile ? '50 auto' : '20px auto 0 auto' }}>

            <Dropdown style={{ width: '100%', margin: isMobile ? '25px auto' : '30px auto' }}>

                <Dropdown.Toggle variant={vivienda.variante}
                    style={{ width: '80%', border: '1px solid black' }}
                >
                    {vivienda.estado}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item
                        onClick={() => cambiarEstado(vivienda.inner_id, noPredicado, vivienda.noAbonado, vivienda.asignado)}>
                        {noPredicado}
                    </Dropdown.Item>
                    
                    <Dropdown.Item
                        onClick={() => cambiarEstado(vivienda.inner_id, contesto, vivienda.noAbonado, vivienda.asignado)}>
                        {contesto}
                    </Dropdown.Item>
                    
                    <Dropdown.Item
                        onClick={() => cambiarEstado(vivienda.inner_id, noContesto, vivienda.noAbonado, vivienda.asignado)}>
                        {noContesto}
                    </Dropdown.Item>
                    
                    <Dropdown.Item
                        onClick={() => cambiarEstado(vivienda.inner_id, aDejarCarta, vivienda.noAbonado, vivienda.asignado)}>
                        {aDejarCarta}
                    </Dropdown.Item>
                    
                    <Dropdown.Item
                        onClick={() => cambiarEstado(vivienda.inner_id, noLlamar, vivienda.noAbonado, vivienda.asignado)}>
                        {noLlamar}
                    </Dropdown.Item>
                </Dropdown.Menu>

            </Dropdown>

        </Row>

        <Row style={{ height: '40%', marginTop: '15px' }}>
            {vivienda.fechaUlt &&
                <div className={`card border-dark mb-3 p-0 ${isDarkMode ? 'bg-white text-black' : ''}`}
                    style={{
                        maxWidth: '18rem',
                        //backgroundColor: 'rgb(214, 214, 214)',
                        display: vivienda.estado === noPredicado ? 'none' : 'block',
                        margin: 'auto'
                    }}
                >
                    
                    <div className={'card-header'} style={{ padding: '0.2rem 0.5rem' }}>
                        <p className={'card-text text-center'}>
                            Se llamó el {timeConverter(vivienda.fechaUlt, true)}
                        </p>
                    </div>

                </div>
            }
        </Row>
    </Col>

    )
}
