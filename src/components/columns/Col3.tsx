import { Col, Row, Dropdown } from 'react-bootstrap'
import { mobile } from '../_App'
import { timeConverter } from '../tools/functions'


export const Col3:any = (props:any) => {

    const { vivienda, cambiarEstado } = props

    return (
    
    <Col xs={12} md={3} style={{margin: mobile ? 'auto' : '0 30px'}}>

        <Row style={{textAlign:"center", height:"30%", margin: mobile ? '50 auto' : '20px auto 0 auto'}}>

            <Dropdown style={{width:'100%', margin: mobile ? '25px auto' : '30px auto'}}>

                <Dropdown.Toggle id="dropdown-basic" variant={vivienda.variante}
                    style={{width:'80%', border:'1px solid black'}}
                >
                    {vivienda.estado}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    
                    <Dropdown.Item onClick={
                        ()=>{cambiarEstado(vivienda.inner_id, "No predicado", vivienda.noAbonado, vivienda.asignado)}
                    }>
                        No predicado
                    </Dropdown.Item>
                    
                    <Dropdown.Item onClick={
                        ()=>{cambiarEstado(vivienda.inner_id, "Contestó", vivienda.noAbonado, vivienda.asignado)}
                    }>
                        Contestó
                    </Dropdown.Item>
                    
                    <Dropdown.Item onClick={
                        ()=>{cambiarEstado(vivienda.inner_id, "No contestó", vivienda.noAbonado, vivienda.asignado)}
                    }>
                        No contestó
                    </Dropdown.Item>
                    
                    <Dropdown.Item onClick={
                        ()=>{cambiarEstado(vivienda.inner_id, "A dejar carta", vivienda.noAbonado, vivienda.asignado)}
                    }>
                        A dejar carta
                    </Dropdown.Item>
                    
                    <Dropdown.Item onClick={
                        ()=>{cambiarEstado(vivienda.inner_id, "No llamar", vivienda.noAbonado, vivienda.asignado)}
                    }>
                        No llamar
                    </Dropdown.Item>
                </Dropdown.Menu>

            </Dropdown>

        </Row>

        <Row style={{height:'40%', marginTop:'15px'}}>
            {vivienda.fechaUlt
            ?
                <div className="card border-dark mb-3"
                    style={{
                        maxWidth:'18rem',
                        backgroundColor:'rgb(214, 214, 214)',
                        display:
                            vivienda.estado==="No predicado" // && vivienda.noAbonado===false
                            ? 'none' : 'block',
                        margin:'auto'
                    }}
                    >
                    
                    <div className='card-header' style={{padding:'0.2rem 0.5rem'}}>
                        <p className='card-text'>
                            Se llamó el {timeConverter(vivienda.fechaUlt, true)}
                        </p>
                    </div>

                </div>
            :
                <div></div>
            }
        </Row>
    </Col>

    )
}
