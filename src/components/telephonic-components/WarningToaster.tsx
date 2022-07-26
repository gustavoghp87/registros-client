import { Toast } from 'react-bootstrap'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { danger, typeRootState } from '../../models'

export const WarningToaster = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const currentUserEmail: string = props.currentUserEmail
    const showWarningToaster: boolean = props.showWarningToaster
    const toggleshowWarningToaster: () => void = props.toggleshowWarningToaster
    const userEmailWarningToaster: string = props.userEmailWarningToaster

    return (
        <Toast
            show={(showWarningToaster && currentUserEmail && currentUserEmail !== userEmailWarningToaster) ? true : false}
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
