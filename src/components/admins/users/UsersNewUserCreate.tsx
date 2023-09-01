import { Dispatch, FC, SetStateAction } from 'react'
import { emailPattern } from '../../../app-config'
import { FloatingLabel, Form } from 'react-bootstrap'
import { registerUserAdminsService } from '../../../services/userServices'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { useDispatch } from 'react-redux'

type propsType = {
    confPassword: string
    email: string
    group: number
    isDarkMode: boolean
    password: string
    setConfPassword: Dispatch<SetStateAction<string>>
    setEmail: Dispatch<SetStateAction<string>>
    setIsLoading: Dispatch<SetStateAction<boolean>>
    setGroup: Dispatch<SetStateAction<number>>
    setPassword: Dispatch<SetStateAction<string>>
    setShowNewUser: Dispatch<SetStateAction<boolean>>
}

export const UsersNewUserCreate: FC<propsType> = ({
    confPassword, email, group, isDarkMode, password, setConfPassword, setEmail, setGroup, setIsLoading, setPassword, setShowNewUser
}) => {

    const dispatch = useDispatch()

    const registerHandler = async () => {
        if (!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group)
            return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Confirmar",
            message: `Se va a crear una cuenta con correo ${email} y contraseña '${password}'`,
            execution: async () => {
                setIsLoading(true)
                const response = await registerUserAdminsService(email, group, password)
                setIsLoading(false)
                if (response?.userExists) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: `Ya existe un usuario con el correo ${email}`,
                        animation: 2
                    }))
                    return
                }
                if (!response?.success) {
                    dispatch(setValuesAndOpenAlertModalReducer({
                        mode: 'alert',
                        title: "Error",
                        message: `No se pudo crear una cuenta con correo ${email}. Mirar los logs.`,
                        animation: 2
                    }))
                    return
                }
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "Logrado",
                    message: `Se creó una cuenta con correo ${email} y contraseña ${password}`,
                    animation: 1
                }))
            }
        }))
    }

    return (<>
        <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
            Crear una cuenta por él
        </h3>

        <FloatingLabel
            className={'mt-5 mb-3 text-dark'}
            label={"Correo electrónico"}
        >
            <Form.Control
                type={'email'}
                className={'form-control'}
                value={email}
                onChange={e => setEmail((e.target as HTMLInputElement).value)}
                autoFocus
            />
        </FloatingLabel>

        <FloatingLabel
            label={"Contraseña"}
            className={'mb-3 text-dark'}
        >
            <Form.Control
                type={'password'}
                className={'form-control'}
                value={password}
                onChange={e => setPassword((e.target as HTMLInputElement).value)}
            />
        </FloatingLabel>

        <FloatingLabel
            className={'mb-3 text-dark'}
            label={"Confirmar Contraseña"}
        >
            <Form.Control
                type={'password'}
                className={'form-control'}
                value={confPassword}
                onChange={e => setConfPassword((e.target as HTMLInputElement).value)}
            />
        </FloatingLabel>

        <FloatingLabel
            label={"Número de Grupo"}
            className={'mb-3 text-dark'}
        >
            <Form.Control
                type={'number'}
                className={'form-control'}
                value={group ? group : ''}
                min={'1'}
                onChange={e => setGroup(parseInt(e.target.value))}
                onKeyDown={e => e.key === 'Enter' && !(!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group) ? registerHandler() : null }
            />
        </FloatingLabel>

        <button
            className={'btn btn-general-blue d-block w-100 mt-4'}
            style={{ fontWeight: 'bolder', height: '50px' }}
            onClick={() => registerHandler()}
            disabled={!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group}
        >
            REGISTRAR CUENTA
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
