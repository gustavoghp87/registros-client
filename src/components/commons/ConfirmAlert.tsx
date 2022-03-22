import { useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'bootstrap/dist/css/bootstrap.min.css'

export const ConfirmAlert = (props: any) => {

    const title: string = props.title
    const message: string = props.message
    const execution: Function = props.execution
    const cancelAction: Function|null = props.cancelAction

    useEffect(() => {
        confirmAlert({
            title,
            message,
            buttons: cancelAction ? [
                {
                    label: 'ACEPTAR',
                    onClick: () => execution()
                },
                {
                    label: 'CANCELAR',
                    onClick: () => cancelAction()
                }
            ] : [
                {
                    label: 'ACEPTAR',
                    onClick: () => execution()
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            overlayClassName: "text-center"
        })
        setTimeout(() => {
            const bodyElements: HTMLCollectionOf<Element> = document.getElementsByClassName('react-confirm-alert-body')
            bodyElements[0]?.classList?.add('text-center')
            bodyElements[0]?.firstElementChild?.classList?.add('h3')
            bodyElements[0]?.firstElementChild?.classList?.add('mb-3')
            const buttonGroupElements: HTMLCollectionOf<Element> = document.getElementsByClassName('react-confirm-alert-button-group')
            buttonGroupElements[0]?.classList?.add('d-block')
            buttonGroupElements[0]?.classList?.add('m-auto')
            buttonGroupElements[0]?.classList?.add('mt-4')
            buttonGroupElements[0]?.firstElementChild?.classList?.add('bg-danger')
        }, 200)
    }, [title, message, execution, cancelAction])

    return (<></>)
}
