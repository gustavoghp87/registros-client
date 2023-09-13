import { Dispatch, FC, SetStateAction } from 'react'
import { emailPattern } from '../../../app-config'
import { FloatingLabel, Form } from 'react-bootstrap'
import { sendInvitationForNewUserService } from '../../../services'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { useDispatch } from 'react-redux'

type propsType = {
    email: string
    isDarkMode: boolean
    setEmail: Dispatch<SetStateAction<string>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
    setShowNewUser: Dispatch<SetStateAction<boolean>>
}

export const UsersNewUserInvite: FC<propsType> = ({ email, isDarkMode, setEmail, setIsLoading, setShowNewUser }) => {
    const dispatch = useDispatch()

    const inviteNewUserHandler = async () => {
        if (!emailPattern.test(email)) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Confirmar",
            message: `Se va a mandar un email a ${email} con una autorización para crear una cuenta`,
            execution: async () => {
                setIsLoading(true)
                const response = await sendInvitationForNewUserService(email)
                setIsLoading(false)
                if (response?.userExists) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: `Ya existe un usuario con ${email} en esta o en otra congregación.`,
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
                if (!response || !response.success) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: `No se pudo invitar a ${email}. Mirar los logs.`,
                        animation: 2
                    }))
                    return
                }
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Logrado",
                    message: `Se invitó a ${email}`,
                    animation: 1
                }))
            }
        }))
    }

    return (<>
        <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
            Enviarle por Email un acceso para que se cree una cuenta
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
                onKeyDown={e => e.key === 'Enter' ? inviteNewUserHandler() : null }
                autoFocus
            />
        </FloatingLabel>

        <button
            className={`btn btn-general-blue d-block w-100 mt-3`}
            style={{ fontWeight: 'bolder', height: '50px' }}
            onClick={inviteNewUserHandler}
            disabled={!emailPattern.test(email)}
        >
            Aceptar
        </button>

        <button
            className={`btn btn-general-red d-block w-100 mt-3`}
            style={{ fontWeight: 'bolder', height: '50px' }}
            onClick={() => setShowNewUser(false)}
        >
            Cancelar
        </button>
    </>)
}
