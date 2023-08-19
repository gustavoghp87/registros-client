import { Col, Row } from 'react-bootstrap'
import { FC } from 'react'
import { Hr } from '../commons'
import { typeCallingState, typeHousehold, typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    household: typeHousehold
    modifyHouseholdHandler: (householdId: number, callingState: typeCallingState, notSubscribed: boolean, isAssigned: boolean|undefined) => void
}

export const Col4: FC<propsType> = ({ household, modifyHouseholdHandler }) => {
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

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

                    <Hr />

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
