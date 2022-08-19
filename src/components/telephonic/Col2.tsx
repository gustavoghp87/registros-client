import { useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import { getReducedPhoneNumber } from '../../services'
import { typeHousehold, typeRootState } from '../../models'

export const Col2 = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const card: any = props.card
    const household: typeHousehold = props.household

    const setCardMarginBottom = (): void => {(card.current as HTMLElement).style.marginBottom = '160px'}

    return (

        <Col xs={12} md={4} style={{ margin: isMobile ? '0' : '20px 0px', padding: isMobile ? '0' : '20px' }}>

            <Row style={{ paddingBottom: '10px' }}>
                <h4 className={'text-center d-block mx-auto'} style={{ fontSize: '1.9rem' }}>
                    Dirección:
                    <br/>
                    {household.address}
                </h4>
            </Row>

            {!household.notSubscribed &&
                <Row style={{ padding: '20px 0 1% 0' }}>
                    <h4 className={'text-center m-auto'}
                        onMouseOver={() => setCardMarginBottom()}
                        style={{ fontSize: isMobile ? '2.5rem' : '3rem' }}
                    >

                        Teléfono:
                        
                        <div className={'pb-2'}>
                            <a href={`tel:${household.phoneNumber}`}>
                                {getReducedPhoneNumber(household.phoneNumber)}
                            </a>
                        </div>
                    </h4>
                </Row>
            }

        </Col>
    )
}
