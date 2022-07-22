import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeHousehold, typeRootState } from '../../models'
import { getReducedPhoneNumber } from '../../services'

export const Col2 = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const cardId: string = props.cardId
    const household: typeHousehold = props.household

    return (

        <Col xs={12} md={4} style={{ margin: isMobile ? '0' : '20px 0px', padding: isMobile ? '0' : '20px' }}>

            <Row style={{ paddingBottom: '10px' }}>
                <h4 style={{ textAlign: 'center', display: 'block', margin: 'auto', fontSize: '1.9rem' }}>
                    Dirección:
                    <br/>
                    {household.direccion}
                </h4>
            </Row>

            {!household.noAbonado &&
                <Row style={{ padding: '20px 0 1% 0' }}>
                    <h4 className={'text-center m-auto'}
                        onMouseOver={() => {
                            const card = document.getElementById(cardId)
                            if (card) card.style.marginBottom = '160px'
                        }}
                        style={{ fontSize: isMobile ? '2.5rem' : '3rem' }}
                    >

                        Teléfono:
                        
                        <div className={'pb-2'}>
                            <a href={`tel:${household.telefono}`}>
                                {getReducedPhoneNumber(household.telefono)}
                            </a>
                        </div>
                    </h4>
                </Row>
            }

        </Col>
    )
}
