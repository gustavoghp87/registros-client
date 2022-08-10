import { useEffect, useRef } from 'react'
import { Toast } from 'react-bootstrap'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { typeRootState } from '../../models'

export const WarningToaster = (props: any) => {

    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)
    const bodyText: string = props.bodyText
    const closeWarningToaster: Function = props.closeWarningToaster
    const headerText: string = props.headerText
    const isCentered: boolean = props.isCentered
    const ref = useRef<any>()

    useEffect(() => {
        if (closeWarningToaster) return
        ref.current?.firstChild?.childNodes.forEach((x: any, index: number) =>
            index === 3 ? (x as HTMLElement).classList.add('d-none') : null
        )
    }, [closeWarningToaster])

    return (<>
        {!isCentered ?
            <Toast show={true}
                bg={'danger'}
                className={'my-2'}
                onClose={() => closeWarningToaster()}
                ref={ref}
                style={{
                    marginLeft: isMobile ? '10px' : '0',
                    maxWidth: '420px',
                    width: isMobile ? '99%' : '380px',
                    zIndex: 3
                }}
            >
                <Toast.Header>
                    <AiOutlineWarning className={'m-1'} style={{ fontSize: 18 }} />
                    <strong className={'me-auto'}> ¡Advertencia! </strong>
                    <small className={!closeWarningToaster ? 'me-4' : 'text-end'}> {headerText} </small>
                </Toast.Header>
                
                <Toast.Body className={'text-center'}>
                    {bodyText}
                </Toast.Body>
            </Toast>
            
            :

            <Toast show={true}
                className={'d-block m-auto'}
                onClose={() => closeWarningToaster()}
                style={{ border: '1px solid lightgray', marginBottom: '50px' }}
            >
                <Toast.Header style={{ border: '1px solid lightgray' }}>
                    <strong className={'me-auto'}> {headerText} </strong>
                </Toast.Header>
                <Toast.Body> {bodyText} </Toast.Body>
            </Toast>
        }
    </>)
}
