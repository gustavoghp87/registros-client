import { Col1, Col2, Col3, Col4 } from '.'
import { Container, Row } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useRef } from 'react'
import { hideLoadingModalReducer, showLoadingModalReducer } from '../../store'
import { modifyHouseholdService } from '../../services'
import { Socket } from 'socket.io-client'
import { telephonicHouseholdChangeString } from '../../constants'
import { typeCallingState, typeHousehold, typeRootState, typeTerritoryNumber } from '../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    household: typeHousehold
    setAddressToShowInGoogleMaps: Dispatch<SetStateAction<string>>
    openAlertModalHandler: (title: string, message: string, animation: number) => void
    socket: Socket
    territoryNumber: typeTerritoryNumber
}

export const TelephonicCard: FC<propsType> = ({ household, openAlertModalHandler, setAddressToShowInGoogleMaps, socket, territoryNumber }) => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const dispatch = useDispatch()
    const householdCard = useRef<any>()

    const modifyHouseholdHandler = (householdId: number,
     callingState: typeCallingState, notSubscribed: boolean, isAssigned: boolean|undefined): void => {
        dispatch(showLoadingModalReducer())
        notSubscribed = !!notSubscribed
        isAssigned = !!isAssigned
        modifyHouseholdService(territoryNumber, householdId, callingState, notSubscribed, isAssigned).then((updatedHousehold: typeHousehold|null) => {
            dispatch(hideLoadingModalReducer())
            if (!updatedHousehold)
                return openAlertModalHandler("Algo falló al modificar", "", 2)
            if (!socket || !socket.connected || !user)
                return openAlertModalHandler("Problema de conexión", "Refrescar y ver si hay internet", 2)
            socket.emit(telephonicHouseholdChangeString, {
                congregation: user.congregation,
                territoryNumber,
                updatedHousehold,
                userEmail: user.email
            })
        })
    }

    return (
        <div
            className={`card ${household.isAssigned ? 'bg-gray bg-opacity bg-gradient' : isDarkMode ? 'bg-dark text-white' : ''} animate__animated animate__bounceInLeft animate__faster`}
            key={household.householdId}
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
                        territoryNumber={territoryNumber}
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
        </div>
    )
}
