import { Toast } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AiOutlineWarning } from 'react-icons/ai'
import { danger, typeRootState } from '../../models'

export const WarningToasterSameTerritory = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const closeWarningToaster: () => void = props.closeWarningToaster
    const userEmailWarningToaster: string = props.userEmailWarningToaster

    return (
        <Toast
            show={true}
            onClose={closeWarningToaster}
            bg={danger}
            style={{
                left: '0',
                marginLeft: isMobile ? '10px' : '20px',
                marginTop: isMobile ? '0' : '25px',
                position: 'fixed',
                width: '370px',
                zIndex: 3
            }}
        >
            <Toast.Header>
                <AiOutlineWarning className={'m-1'} style={{ fontSize: 18 }} />
                <strong className={'me-auto'}> ¡Advertencia! </strong>
                <small> Posible confusión de asignación </small>
            </Toast.Header>
            
            <Toast.Body className={'text-center'}>
                Este territorio está siendo trabajado por el usuario <strong>{userEmailWarningToaster}</strong>
            </Toast.Body>
        </Toast>
    )
}
