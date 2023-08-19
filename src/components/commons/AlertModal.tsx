import 'react-confirm-alert/src/react-confirm-alert.css'
import { adjustModalStyles, insertAnimationForAlertModal } from '../../services'
import { closeAlertModalReducer } from '../../store'
import { confirmAlert } from 'react-confirm-alert'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

export const AlertModal = () => {
    const { mode, title, message, execution, animation } = useSelector((state: typeRootState) => state.alertModal)
    const dispatch = useDispatch()
    
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
            // onClickOutside: () => {},
            // onKeypressEscape: () => {},
        })
        adjustModalStyles()
        if (animation) insertAnimationForAlertModal(animation)
    }, [animation, dispatch, execution, message, mode, title])

    return (<></>)
}
