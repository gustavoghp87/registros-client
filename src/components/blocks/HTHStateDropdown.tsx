import { Col, Row, Dropdown } from 'react-bootstrap'
import { isMobile, timeConverter } from '../../services/functions'
import { modifyHTHHouseholdStateService } from '../../services/houseToHouseServices'
import { typeHTHHousehold, typeHTHState } from '../../models/houseToHouse'
import { noPredicado, contesto, noContesto, noTocar, cartaDejada } from '../../models/houseToHouse'

export const HTHStateDropdown = (props: any) => {

    const household: typeHTHHousehold = props.vivienda
    const buildingId: string = props.buildingId
    
    const changeState = async (household: typeHTHHousehold, state: typeHTHState): Promise<void> => {
        household.estado = state
        const success: boolean = await modifyHTHHouseholdStateService(household, buildingId)
        if (!success) alert("Algo falló; verificar conexión")
    }


    return (
    
        <Col style={{ margin: 'auto' }}>

            <Row style={{ textAlign: 'center', margin: isMobile ? '50 auto' : '0 auto' }}>

                <Dropdown style={{ width: '100%', margin: '30px auto' }}>

                    <Dropdown.Toggle variant={household.variant}
                        style={{ width: '80%', border: '1px solid black' }}
                    >
                        {household.estado}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => changeState(household, noPredicado)}>
                            {noPredicado}
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => changeState(household, contesto)}>
                            {contesto}
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => changeState(household, noContesto)}>
                            {noContesto}
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => changeState(household, cartaDejada)}>
                            {cartaDejada}
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => changeState(household, noTocar)}>
                            {noTocar}
                        </Dropdown.Item>
                    </Dropdown.Menu>

                </Dropdown>

            </Row>

            {!!household.lastTime && parseInt(household.lastTime) > 1600000000 &&
                <Row style={{ margin: '15px auto', maxWidth: '100%' }}>
                    <div className={'card border-dark mb-3'}
                        style={{
                            maxWidth: '18rem',
                            backgroundColor: 'rgb(214, 214, 214)',
                            display: household.estado === noPredicado ? 'none' : '',
                            margin: 'auto'
                        }}
                    >
                        <div className={'card-header'} style={{ padding: '0.2rem 0.5rem' }}>
                            <p className={'card-text text-center'}>
                                {`Se visitó el ${timeConverter(household.lastTime, true)}`}
                            </p>
                        </div>
                    </div>
                </Row>
            }
        </Col>
    )
}
