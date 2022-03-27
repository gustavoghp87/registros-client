import { Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { typeHousehold } from '../../models/territory'
import { typeRootState } from '../../store/store'

export const Col2 = (props: any) => {

    const household: typeHousehold = props?.household
    const id: string = props?.id
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    const getReducedPhoneNumber = (phoneNumber: string): string => {
        if (!phoneNumber || phoneNumber.length < 7) return phoneNumber
        if (phoneNumber.substring(0, 6) === "54-11-") return phoneNumber.substring(6)
        if (phoneNumber.substring(0, 3) === "54-") return phoneNumber.substring(3)
        return phoneNumber
    }

    return (

        <Col xs={12} md={4} style={{ margin: isMobile ? '0' : '20px 0px', padding: isMobile ? '0' : '20px' }}>

            <Row style={{ paddingBottom: '10px' }}>
                <h4 style={{ textAlign: 'center', display: 'block', margin: 'auto', fontSize: '1.9rem' }}>
                    Dirección:
                    <br/>
                    {household?.direccion}
                </h4>
            </Row>

            <Row style={{ padding: '20px 0 1% 0' }}>
                
                <h4 className={'text-center m-auto'}
                    style={{
                        display: household?.noAbonado ? 'none' : 'block',
                        fontSize: isMobile ? '2.5rem' : '3rem'
                    }}
                    onMouseOver={() => {
                        //document.getElementById(id)!.style.marginTop = '140px'
                        document.getElementById(id)!.style.marginBottom = '160px'
                    }}
                    // onMouseOut={() => {
                    //     document.getElementById(id)!.style.marginTop = '0'
                    //     document.getElementById(id)!.style.marginBottom = '50px'
                    // }}
                >

                    Teléfono:
                    
                    <div
                        className={'pb-2'}
                        style={{ marginTop: '7px' }}
                    >
                        <a href={`tel:${household?.telefono}`}>
                            {getReducedPhoneNumber(household?.telefono)}
                        </a>
                    </div>

                </h4>

            </Row>
        </Col>
    )
}
