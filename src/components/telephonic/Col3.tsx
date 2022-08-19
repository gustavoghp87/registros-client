import { Col, Row, Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { timeConverter } from '../../services'
import { typeCallingState, typeHousehold, typeRootState } from '../../models'

const aDejarCarta: typeCallingState = 'A dejar carta'
const contesto: typeCallingState = 'Contestó'
const noContesto: typeCallingState = 'No contestó'
const noLlamar: typeCallingState = 'No llamar'
const noPredicado: typeCallingState = 'No predicado'

export const Col3 = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const household: typeHousehold = props.household
    const modifyHouseholdHandler: Function = props.modifyHouseholdHandler

    return (
        <Col xs={12} md={3} style={{ margin: isMobile ? 'auto' : '0 30px' }}>

            <Row style={{ textAlign: 'center', height: '30%', margin: isMobile ? '50 auto' : '20px auto 0 auto' }}>

                <Dropdown style={{ width: '100%', margin: isMobile ? '25px auto' : '30px auto' }}>

                    <Dropdown.Toggle variant={household.variant}
                        style={{ width: '80%', border: '1px solid black' }}
                    >
                        {household.callingState}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.householdId, noPredicado, household.notSubscribed, household.isAssigned)}>
                            {noPredicado}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.householdId, contesto, household.notSubscribed, household.isAssigned)}>
                            {contesto}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.householdId, noContesto, household.notSubscribed, household.isAssigned)}>
                            {noContesto}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.householdId, aDejarCarta, household.notSubscribed, household.isAssigned)}>
                            {aDejarCarta}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.householdId, noLlamar, household.notSubscribed, household.isAssigned)}>
                            {noLlamar}
                        </Dropdown.Item>
                    </Dropdown.Menu>

                </Dropdown>

            </Row>

            <Row style={{ height: '40%', marginTop: '15px' }}>
                {household.dateOfLastCall && household.callingState !== noPredicado &&
                    <div className={`card border-dark mb-3 p-0 ${isDarkMode ? 'bg-white text-black' : ''}`}
                        style={{
                            margin: 'auto',
                            maxWidth: '18rem'
                        }}
                    >
                        
                        <div className={'card-header'} style={{ padding: '0.2rem 0.5rem' }}>
                            <p className={'card-text text-center'}>
                                Se llamó el {timeConverter(household.dateOfLastCall)}
                            </p>
                        </div>

                    </div>
                }
            </Row>
        </Col>
    )
}
