import { Toast } from 'react-bootstrap'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../store/store'
import { danger } from '../../models/territory'

export const WarningToaster = (props: any) => {

    const { showWarningToaster, toggleshowWarningToaster, userEmailWarningToaster, currentUserEmail } = props
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    return (
        <Toast
            show={(showWarningToaster && currentUserEmail && currentUserEmail !== userEmailWarningToaster)}
            onClose={toggleshowWarningToaster}
            bg={danger}
            style={{
                width: '370px',
                position: 'fixed',
                left: '0',
                marginLeft: isMobile ? '10px' : '20px',
                marginTop: isMobile ? '0' : '25px',
                zIndex: 3
            }}
        >
            <Toast.Header>
                <AiOutlineWarning className={'m-1'} style={{ fontSize: 18 }} />
                <strong className={'me-auto'}>¡Advertencia!</strong>
                <small>Posible confusión de asignación</small>
            </Toast.Header>
            <Toast.Body className={'text-center'}>
                Este territorio está siendo trabajado por el usuario <strong>{userEmailWarningToaster}</strong>
            </Toast.Body>
        </Toast>
    )
}
