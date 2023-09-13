import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { emailPattern } from '../../app-config'
import { getFailingEmailFromLSService, getUserByTokenService, loginService, sendLinkToRecoverAccount, setFailingEmailToLSService } from '../../services'
import { Loading } from '../commons'
import { logoutReducer, refreshUserReducer, setConfigurationReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { typeResponseData, typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export const LoginPage = () => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const { executeRecaptcha } = useGoogleReCaptcha()
    const dispatch = useDispatch()

    const openAlertModalHandler = (title: string, message: string, animation: number, execution?: Function): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation,
            execution
        }))
    }

    const recoverAccountHandler = (): void => {
        if (!email || !emailPattern.test(email)) {
            openAlertModalHandler("Escribir el email primero", "", 2)
            return
        }
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Recuperar cuenta?",
            message: `Esto enviará un correo a ${email} para cambiar la contraseña`,
            execution: async () => {
                setLoading(true)
                const response = await sendLinkToRecoverAccount(email)
                setLoading(false)
                if (response && response.success)
                    openAlertModalHandler(`Se envió un correo a ${email}`, "", 1)
                else if (response && response.noUser)
                    openAlertModalHandler("Este email no es de un usuario registrado:", `${email}`, 2)
                else if (response && response.notSent)
                    openAlertModalHandler("Algo falló", `No se pudo mandar un correo a ${email}`, 2)
                else
                    openAlertModalHandler("Algo falló", "", 2)
            }
        }))
    }

    const loginHandler = async (): Promise<void> => {
        if (!email || !emailPattern.test(email) || password.length < 6)
            return openAlertModalHandler("Problemas", "Faltan datos", 2)
        if (!executeRecaptcha)
            return
        const recaptchaToken: string = await executeRecaptcha()
        if (!recaptchaToken)
            return openAlertModalHandler("Problemas (1)", "Refrescar la página", 2)
        setLoading(true)
        const response: typeResponseData|null = await loginService(email, password, recaptchaToken)
        setLoading(false)
        if (response && response.success && response.newToken) {
            const { user, config } = await getUserByTokenService(response.newToken)
            if (user === false) {
                dispatch(logoutReducer())
            }
            if (!user || !config)
                return openAlertModalHandler("Problemas (2)", "Refrescar la página; ver si hay internet", 2)
            dispatch(refreshUserReducer(user))
            dispatch(setConfigurationReducer(config))
        } else if (!response || response.recaptchaFails) {
            setFailingEmailToLSService(email)
            openAlertModalHandler("Problemas (3)", "Refrescar la página", 2)
        } else if (response && response.isDisabled) {
            openAlertModalHandler("No habilitado", "Usuario aun no habilitado por el grupo de territorios... avisarles", 2)
        } else {
            setFailingEmailToLSService(email)
            openAlertModalHandler("Datos incorrectos", "", 2, () => window.location.reload())
        }
    }

    // const registerHandler = async (): Promise<void> => {
    //     if (!email || !emailPattern.test(email) || !password || !confPassword || !team || !group)
    //         return openAlertModalHandler("Problemas", "Faltan datos", 2)
    //     if (password.length < 8)
    //         return openAlertModalHandler("Problemas", "La contraseña es demasiado corta (mínimo 8)", 2)
    //     if (password !== confPassword)
    //         return openAlertModalHandler("Problemas", "La contraseña no coincide con su confirmación", 2)
    //     if (!executeRecaptcha)
    //         return openAlertModalHandler("Problemas", "Se refrescará la página por un problema", 2, () => window.location.reload())
    //     executeRecaptcha().then(async (recaptchaToken: string) => {
    //         if (!recaptchaToken)
    //             return openAlertModalHandler("Problemas", "Se refrescará la página por un problema", 2, () => window.location.reload())
    //         setLoading(true)
    //         const data: typeResponseData|null = await registerUserService(email, group, password, recaptchaToken, team)
    //         setLoading(false)
    //         if (!data) {
    //             openAlertModalHandler("Problemas", "Algo salió mal", 2, () => window.location.reload())
    //         } else if (data.recaptchaFails) {
    //             openAlertModalHandler("Problemas", "Se refrescará la página por un problema", 2, () => window.location.reload())
    //         } else if (data.userExists) {
    //             openAlertModalHandler("Problemas", "Ya existe un usuario con ese correo", 2, () => navigate('/acceso'))
    //         } else if (data.success) {
    //             openAlertModalHandler("Registro exitoso", `Resta ser habilitado por el grupo de predicación. ${email}`, 1, () => navigate('/'))
    //         } else {
    //             openAlertModalHandler("Respuesta desconocida", `Algo falló. ${email}`, 2, () => navigate('/'))
    //         }
    //     })
    // }

    useEffect(() => {
        const failingEmail = getFailingEmailFromLSService()
        if (!failingEmail) {
            document.getElementById('emailInput')?.focus()
            return
        }
        setEmail(failingEmail)
        document.getElementById('passwordInput')?.focus()
    }, [])

    return (<>

        <Container className={isDarkMode ? 'bg-dark' : 'bg-white'}
            style={{
                border: '1px solid black',
                borderRadius: '12px',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                marginBottom: '50px',
                marginTop: '60px',
                maxWidth: '600px',
                padding: '50px 0 0'
            }}
        >

            <h2 className={`text-center mx-auto ${isDarkMode ? 'text-white' : ''}`}
                style={{
                    fontSize: isMobile ? '1.7rem' : '2rem',
                    maxWidth: '90%',
                    textShadow: '0 0 1px gray'
                }}
            >
                INGRESAR
            </h2>

            <Container style={{ maxWidth: '500px', padding: isMobile ? '35px 30px 0' : '35px 0 0' }}>

                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={"Correo electrónico"}
                >
                    <Form.Control
                        type={'email'}
                        id={"emailInput"}
                        className={'form-control'}
                        autoComplete={'email'}
                        placeholder={""}
                        value={email}
                        onChange={e => setEmail((e.target as HTMLInputElement).value)}
                    />
                </FloatingLabel>

                <FloatingLabel
                    label={"Contraseña"}
                    className={'mb-3 text-dark'}
                >
                    <Form.Control
                        type={'password'}
                        id={"passwordInput"}
                        className={'form-control'}
                        placeholder={""}
                        value={password}
                        onChange={e => setPassword((e.target as HTMLInputElement).value)}
                        onKeyDown={e => e.key === 'Enter' ? loginHandler() : null }
                    />
                </FloatingLabel>

                <button
                    className={'btn btn-general-blue d-block w-100 mt-3'}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => loginHandler()}
                    disabled={!emailPattern.test(email) || password.length < 8}
                >
                    ENTRAR
                </button>

                <p className={'text-end mt-3'}
                    style={{
                        color: '#0000cd',
                        fontSize: '1rem',
                        margin: '0 0 22px',
                        textDecoration: 'underline'
                    }}
                >
                    <span className={`pointer ${isDarkMode ? 'text-white' : ''}`}
                        onClick={() => recoverAccountHandler()}
                    >
                        Olvidé mi contraseña
                    </span>
                </p>

            </Container>
        </Container>

        {loading && <Loading mt={'40px'} />}

    </>)
}
