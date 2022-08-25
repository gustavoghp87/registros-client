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

                    <input className={'checkbox-1'} type={'checkbox'}
                        checked={!!household.notSubscribed}
                        onChange={() => { }}
                        onClick={() => modifyHouseholdHandler(household.householdId, household.callingState, !household.notSubscribed, !!household.isAssigned)}
                        style={{ marginTop: '0.5rem', padding: 5, marginLeft: '0rem' }}
                    />

                    <hr/>

                    <h4 className={'form-check-label'} style={{ fontSize: isMobile ? '1.3rem' : '1.1rem', fontWeight: 600 }}>
                        Asignado
                    </h4>

                    <input className={'checkbox-1'}
                        checked={!!household.isAssigned}
                        onChange={() => { }}
                        onClick={() => modifyHouseholdHandler(household.householdId, household.callingState, !!household.notSubscribed, !household.isAssigned)}
                        style={{ marginLeft: '0rem', marginTop: '0.5rem', padding: 5 }}
                        type={'checkbox'}
                    />
                </div>
            </Row>
        </Col>
    )
}
