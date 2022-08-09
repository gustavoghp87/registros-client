import { Col, Row, Dropdown } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { timeConverter } from '../../services'
import { aDejarCarta, contesto, noContesto, noLlamar, noPredicado, typeHousehold, typeRootState } from '../../models'

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

                    <Dropdown.Toggle variant={household.variante}
                        style={{ width: '80%', border: '1px solid black' }}
                    >
                        {household.estado}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.inner_id, noPredicado, household.noAbonado, household.asignado)}>
                            {noPredicado}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.inner_id, contesto, household.noAbonado, household.asignado)}>
                            {contesto}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.inner_id, noContesto, household.noAbonado, household.asignado)}>
                            {noContesto}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.inner_id, aDejarCarta, household.noAbonado, household.asignado)}>
                            {aDejarCarta}
                        </Dropdown.Item>
                        
                        <Dropdown.Item
                            onClick={() => modifyHouseholdHandler(household.inner_id, noLlamar, household.noAbonado, household.asignado)}>
                            {noLlamar}
                        </Dropdown.Item>
                    </Dropdown.Menu>

                </Dropdown>

            </Row>

            <Row style={{ height: '40%', marginTop: '15px' }}>
                {household.fechaUlt && household.estado !== noPredicado &&
                    <div className={`card border-dark mb-3 p-0 ${isDarkMode ? 'bg-white text-black' : ''}`}
                        style={{
                            margin: 'auto',
                            maxWidth: '18rem'
                        }}
                    >
                        
                        <div className={'card-header'} style={{ padding: '0.2rem 0.5rem' }}>
                            <p className={'card-text text-center'}>
                                Se llamó el {timeConverter(household.fechaUlt, true)}
                            </p>
                        </div>

                    </div>
                }
            </Row>
        </Col>
    )
}
