import { useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { useDispatch, useSelector } from 'react-redux'
import { closeAlertModalReducer } from '../../store/AlertModalSlice'
import { adjustModalStyles } from '../../services'
import { typeAppDispatch, typeRootState } from '../../models'
import 'bootstrap/dist/css/bootstrap.min.css'

export const AlertModal = () => {

    const { mode, title, message, execution } = useSelector((state: typeRootState) => state.alertModal)
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    
    useEffect(() => {
        const closeModalHandler = () => dispatch(closeAlertModalReducer())
        confirmAlert({
            title,
            message,
            buttons:
                execution ?
                    mode === 'alert' ?
                    [
                        {
                            label: 'ACEPTAR',
                            onClick: () => execution()
                        }
                    ]
                    :
                    [
                        {
                            label: 'ACEPTAR',
                            onClick: () => execution()
                        },
                        {
                            label: 'CANCELAR',
                            onClick: () => closeModalHandler()
                        }
                    ]
                :
                    [
                        {
                            label: 'ACEPTAR',
                            onClick: () => closeModalHandler()
                        }
                    ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            willUnmount: () => closeModalHandler()
            // overlayClassName: "text-center",
            // onClickOutside: () => { console.log("click outside") },
            // onKeypressEscape: () => {console.log("key press escape") },
        })
        adjustModalStyles()
    }, [mode, title, message, execution, dispatch])

    return (<></>)
}
