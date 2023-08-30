import { ButtonGroup, Container, FloatingLabel, Form, ToggleButton } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { emailPattern } from '../../../app-config'
import { generalBlue } from '../../../constants'
import { inviteNewUserService } from '../../../services/configServices'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeRootState } from '../../../models'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { registerUserService } from '../../../services/userServices'

const radios = [
    { name: 'Invitar', value: '1' },
    { name: 'Crear', value: '2' }
]

type propsType = {
    setIsLoading: Dispatch<SetStateAction<boolean>>
    setShowNewUser: Dispatch<SetStateAction<boolean>>
}

export const UsersNewUser: FC<propsType> = ({ setIsLoading, setShowNewUser }) => {
    const isDarkMode = useSelector((state: typeRootState) => state.darkMode.isDarkMode)
    const [confPassword, setConfPassword] = useState("")
    const [email, setEmail] = useState("")
    const [group, setGroup] = useState(0)
    const [password, setPassword] = useState("")
    const [radioValue, setRadioValue] = useState('1')
    const dispatch = useDispatch()

    const inviteNewUserHandler = async () => {
        if (!emailPattern.test(email)) return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Confirmar",
            message: `Se va a mandar un email a ${email} con una autorización para crear una cuenta`,
            execution: async () => {
                setIsLoading(true)
                const success: boolean = await inviteNewUserService(email)
                if (!success) {
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

    const registerHandler = async () => {
        if (!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group)
            return
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "Confirmar",
            message: `Se va a crear una cuenta con correo ${email} y contraseña '${password}'`,
            execution: async () => {
                setIsLoading(true)
                const response = await registerUserService(email, group, password)
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

    return (
        <Container className={'mt-4'} style={{ maxWidth: '400px' }}>

            <ButtonGroup className={'w-100 mt-3 mb-2'}>
                {radios.map((radio, idx) => (
                    <ToggleButton key={idx}
                        id={`radio-${idx}`}
                        type={'radio'}
                        className={radioValue === radio.value ? '' : 'bg-secondary'}
                        style={{ backgroundColor: radioValue === radio.value ? generalBlue : undefined }}
                        checked={radioValue === radio.value}
                        value={radio.value}
                        onChange={e => setRadioValue(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>

            {radioValue === '1' ?
                <>
                    <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
                        Enviarle por Email un acceso para que se cree una cuenta
                    </h3>
                    <FloatingLabel
                        className={'mt-5 mb-3 text-dark'}
                        label={"Dirección de email"}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'email'}
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
                        // disabled={!email || !emailPattern.test(email)}
                        disabled={true}
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
                </>
                :
                <>
                    <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
                        Crear una cuenta por él
                    </h3>

                    <Container className={`p-3 ${isDarkMode ? 'bg-dark' : 'bg-white'}`}
                        style={{
                            border: '1px solid black',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                            marginBottom: '50px',
                            marginTop: '60px',
                            maxWidth: '600px',
                        }}
                    >

                        <FloatingLabel
                            className={'mb-3 text-dark'}
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
                        {/* <Link to={'/acceso'}>
                            <p style={{
                                fontSize: '1.1rem',
                                margin: '15px 0 20px 0',
                                textAlign: 'end'
                            }}>
                                Cancelar
                            </p>
                        </Link> */}

                    </Container>
                </>
            }

        </Container>
    )
}
