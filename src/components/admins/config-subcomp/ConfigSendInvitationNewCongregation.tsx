import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { emailPattern } from '../../../app-config'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../../store'
import { sendInvitationForNewUserService } from '../../../services/configServices'
import { typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    setShowInvitationForNewCongregation: Dispatch<SetStateAction<boolean>>
}

export const ConfigSendInvitationNewCongregation: FC<propsType> = ({ setShowInvitationForNewCongregation }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.mobileMode.isMobile)
    const [email, setEmail] = useState("")
    const dispatch = useDispatch()

    const sendInvitationForNewCongregationHandler = async () => {
        if (!emailPattern.test(email)) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Confirmar",
            message: `Se le va a enviar una invitación a ${email} para que cree y sea administrador de una nueva Congregación`,
            execution: async () => {
                dispatch(showLoadingModalReducer())
                const response = await sendInvitationForNewUserService(email, true)
                dispatch(hideLoadingModalReducer())
                if (response?.success) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Logrado",
                        message: `Se envió una invitación para crear una Congregación a ${email}`,
                        animation: 1,
                        execution: () => setShowInvitationForNewCongregation(false)
                    }))
                    return
                }
                if (response?.userExists) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: "Ya hay una cuenta con esta dirección de email",
                        animation: 2
                    }))
                    return
                }
                if (response?.notSent) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: `Hubo un error al enviar un correo a ${email}. Mirar los logs.`,
                        animation: 2
                    }))
                    return
                }
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Algo falló",
                    message: "Mirar los logs",
                    animation: 2
                }))
            }
        }))
    }

    return (
        <Container className={'maxw-400 mt-4'}>

            <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
                Enviar por Email un acceso para ser administrador y primer usuario de una Congregación nueva
            </h3>

            <FloatingLabel
                className={'mt-5 mb-3 text-dark'}
                label={"Dirección de email"}
            >
                <Form.Control
                    type={'email'}
                    className={'form-control'}
                    placeholder={""}
                    value={email}
                    onChange={e => setEmail((e.target as HTMLInputElement).value)}
                    onKeyDown={e => e.key === 'Enter' ? sendInvitationForNewCongregationHandler() : null }
                    autoFocus
                />
            </FloatingLabel>

            <button
                className={`btn btn-general-blue d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={sendInvitationForNewCongregationHandler}
                disabled={!emailPattern.test(email)}
            >
                Aceptar
            </button>

            <button
                className={`btn btn-general-red d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={() => setShowInvitationForNewCongregation(false)}
            >
                Cancelar
            </button>
        </Container>
    )
}
