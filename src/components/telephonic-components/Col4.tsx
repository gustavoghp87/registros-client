import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeHousehold, typeRootState } from '../../models'

export const Col4 = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const household: typeHousehold = props.household
    const modifyHouseholdHandler = props.modifyHouseholdHandler

    return (
        <Col xs={12} md={2}>
            <Row style={{ textAlign: 'center', height: '100%' }}>

                <div style={{ display: 'block', margin: isMobile ? '20px auto' : 'auto' }}>

                    <h4 className={'form-check-label'} style={{ fontSize: isMobile ? '1.3rem' : '1.1rem', fontWeight: 600 }}>
                        No abonado en servicio
                    </h4>

                    <input className={'checkboxuno'} type={'checkbox'}
                        checked={!!household.noAbonado}
                        onChange={() => { }}
                        onClick={() => modifyHouseholdHandler(household.inner_id, household.estado, !household.noAbonado, !!household.asignado)}
                        style={{ marginTop: '0.5rem', padding: 5, marginLeft: '0rem' }}
                    />

                    <hr/>

                    <h4 className={'form-check-label'} style={{ fontSize: isMobile ? '1.3rem' : '1.1rem', fontWeight: 600 }}>
                        Asignado
                    </h4>

                    <input className={'checkboxuno'} type={'checkbox'}
                        checked={!!household.asignado}
                        onChange={() => { }}
                        onClick={() => modifyHouseholdHandler(household.inner_id, household.estado, !!household.noAbonado, !household.asignado)}
                        style={{ marginTop: '0.5rem', padding: 5, marginLeft: '0rem' }}
                    />
                </div>
            </Row>
        </Col>
    )
}
