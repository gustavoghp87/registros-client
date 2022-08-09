import { useDispatch, useSelector } from 'react-redux'
import { Card, Container, Row } from 'react-bootstrap'
import { Socket } from 'socket.io-client'
import { Col1, Col2, Col3, Col4 } from '.'
import { householdChangeString, typeAppDispatch, typeHousehold, typeRootState } from '../../models'
import { hideLoadingModalReducer, showLoadingModalReducer } from '../../store'
import { modifyHouseholdService } from '../../services'
import { useRef } from 'react'

export const TelephonicCard = (props: any) => {

    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const householdCard = useRef<any>()
    const household: typeHousehold = props.household
    const setAddressToShowInGoogleMaps: Function = props.setAddressToShowInGoogleMaps
    const openAlertModalHandler: Function = props.openAlertModalHandler
    const socket: Socket = props.socket

    const modifyHouseholdHandler = async (inner_id: string, estado: string, noAbonado: boolean, asignado: boolean|undefined): Promise<void> => {
        dispatch(showLoadingModalReducer())
        noAbonado = !!noAbonado
        asignado = !!asignado
        const updatedHousehold: typeHousehold|null = await modifyHouseholdService(inner_id, estado, noAbonado, asignado)
        dispatch(hideLoadingModalReducer())
        if (!updatedHousehold) return openAlertModalHandler("Algo falló al modificar", "")
        if (!socket || !socket.connected || !user)
            return openAlertModalHandler("Problema de conexión", "Refrescar y ver si hay internet")
        socket.emit(householdChangeString, {
            updatedHousehold,
            userEmail: user.email
        })
    }

    return (
        <Card
            className={`${household.asignado ? 'bg-gray bg-opacity bg-gradient' : isDarkMode ? 'bg-dark text-white' : ''} animate__animated animate__bounceInLeft animate__faster`}
            key={household.inner_id}
            ref={householdCard}
            style={{
                border: '1px solid gray',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                marginBottom: '50px'
            }}
        >   
            <Container fluid={'lg'}>

                <Row style={{ margin: '0 25px', paddingBottom: '12px', paddingTop: '15px' }}>

                    <Col1
                        household={household}
                        setAddressToShowInGoogleMaps={setAddressToShowInGoogleMaps}
                    />

                    <Col2
                        household={household}
                        card={householdCard}
                    />

                    <Col3
                        household={household}
                        modifyHouseholdHandler={modifyHouseholdHandler}
                    />

                    <Col4
                        household={household}
                        modifyHouseholdHandler={modifyHouseholdHandler}
                    />

                </Row>
            </Container>
        </Card>
    )
}
