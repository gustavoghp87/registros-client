import { useEffect, useRef } from 'react'
import { Toast } from 'react-bootstrap'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { danger, typeRootState } from '../../models'

export const WarningToaster = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const bodyText: string = props.bodyText
    const closeWarningToaster: Function = props.closeWarningToaster
    const headerText: string = props.headerText
    const ref = useRef<any>()

    useEffect(() => {
        if (closeWarningToaster) return
        ref.current?.firstChild?.childNodes.forEach((x: any, index: number) =>
            index === 3 ? (x as HTMLElement).classList.add('d-none') : null
        )
    }, [closeWarningToaster])

    return (
        <Toast show={true} onClose={() => closeWarningToaster()}
            bg={danger}
            ref={ref}
            style={{
                marginLeft: isMobile ? '10px' : '0',
                maxWidth: '420px',
                width: isMobile ? undefined : '380px',
                zIndex: 3
            }}
        >
            <Toast.Header>
                <AiOutlineWarning className={'m-1'} style={{ fontSize: 18 }} />
                <strong className={'me-auto'}> ¡Advertencia! </strong>
                <small className={!closeWarningToaster ? 'mr-4' : 'text-right'}> {headerText} </small>
            </Toast.Header>
            
            <Toast.Body className={'text-center'}>
                {bodyText}
            </Toast.Body>
        </Toast>
    )
}

// <Toast className={'mt-5 mx-auto'} show={true} onClose={() => closeWarningToaster()}>
//     <Toast.Header className={'d-flex justify-content-between'}>
//         <span className={'mt-1'}>
//             <AiOutlineWarning className={'mb-1 ml-3'} style={{ fontSize: 22 }} />
//             <span style={{ fontSize: 17 }}> <strong> ¡Advertencia! </strong> </span>
//         </span>
//     </Toast.Header>
//     <Toast.Body className={'pl-4 pt-2'}>
//         <span> {bodyText} </span>
//     </Toast.Body>
// </Toast>
