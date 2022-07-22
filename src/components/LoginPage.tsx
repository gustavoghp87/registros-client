import { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from './commons/Loading'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { useAuth } from '../context/authContext'
import { getFailingEmailFromLSService, registerUserService, sendLinkToRecoverAccount, setFailingEmailFromLSService } from '../services'
import { typeAppDispatch, typeResponseData, typeRootState } from '../models'

export const LoginPage = () => {

    //const user: typeUser|undefined = useAuth().user
    const { executeRecaptcha } = useGoogleReCaptcha()
    const { login, user } = useAuth()
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const [confPassword, setConfPassword] = useState<string>('')
    const [email, setEmail] = useState<string>("")
    const [group, setGroup] = useState<number>(0)
    const [isRegister, setIsRegister] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")

    const clearInputs = (): void => {
        if (isRegister) setEmail(getFailingEmailFromLSService() ?? "")
        else setEmail('')
        setPassword('')
        setConfPassword('')
        setGroup(0)
        if (email && isRegister) document.getElementById('passwordInput')?.focus()
        else document.getElementById('emailInput')?.focus()
    }

    const openAlertModalHandler = (title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution
        }))
        setLoading(false)
    }

    const openConfirmModalHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Recuperar cuenta?",
            message: `Esto enviará un correo a ${email} para cambiar la contraseña`,
            execution: sendEmailHandler
        }))
    }

    const sendEmailHandler = async (): Promise<void> => {
        setLoading(true)
        const response = await sendLinkToRecoverAccount(email)
        if (response && response.success) openAlertModalHandler(`Se envió un correo a ${email}`, "")
        else if (response && response.noUser) openAlertModalHandler("Este email no es de un usuario registrado:", `${email}`)
        else if (response && response.notSent) openAlertModalHandler("Algo falló", `No se pudo mandar un correo a ${email}`)
        else openAlertModalHandler("Algo falló", "")
        setLoading(false)
    }

    const loginHandler = async (): Promise<void> => {
        setLoading(true)
        if (email.length === 0 || password.length < 6) return openAlertModalHandler("Problemas", "Faltan datos")
        if (!executeRecaptcha) return setLoading(false)
        const recaptchaToken = await executeRecaptcha("")
        if (!login) return openAlertModalHandler("Problemas", "Refrescar la página")
        const response: typeResponseData|null = await login(email, password, recaptchaToken)
        if (response && response.success && response.newToken) {
            window.location.href = '/index'
        } else if (!response || response.recaptchaFails) {
            setFailingEmailFromLSService(email)
            openAlertModalHandler("Problemas", "Refrescar la página")
        } else if (response && response.isDisabled) {
            openAlertModalHandler("No habilitado", "Usuario aun no habilitado por el grupo de territorios... avisarles")
        } else {
            setFailingEmailFromLSService(email)
            openAlertModalHandler("Datos incorrectos", "", () => window.location.reload())
        }
    }

    const registerHandler = async (): Promise<void> => {
        setLoading(true)
        if (!email || !password || !confPassword || !group)
            return openAlertModalHandler("Problemas", "Faltan datos")
        if (password.length < 8)
            return openAlertModalHandler("Problemas", "La contraseña es demasiado corta (mínimo 8)")
        if (password !== confPassword)
            return openAlertModalHandler("Problemas", "La contraseña no coincide con su confirmación")
        if (!executeRecaptcha)
            return openAlertModalHandler("Problemas", "Se refrescará la página por un problema", () => window.location.reload())
        executeRecaptcha().then(async (recaptchaToken: string) => {
            if (!recaptchaToken)
                return openAlertModalHandler("Problemas", "Se refrescará la página por un problema", () => window.location.reload())
            const data: typeResponseData|null = await registerUserService(email, password, group, recaptchaToken)
            if (data) {
                if (data.recaptchaFails) {
                    openAlertModalHandler("Problemas", "Se refrescará la página por un problema", () => window.location.reload())
                } else if (data.userExists) {
                    openAlertModalHandler("Problemas", "Ya existe un usuario con ese correo", () => window.location.href = '/acceso')
                } else if (data.success) {
                    openAlertModalHandler("Registro exitoso", `Resta ser habilitado por el grupo de predicación. ${email}`, () => window.location.href = '/')
                }
            } else {
                openAlertModalHandler("Problemas", "Algo salió mal", () => window.location.reload())
            }
        })
    }
    
    useEffect(() => {
        if (user && user.isAuth) window.location.href = '/index'
    }, [user])

    useEffect(() => {
        const failingEmail: string|null = getFailingEmailFromLSService()
        if (failingEmail) {
            setEmail(failingEmail)
            document.getElementById('passwordInput')?.focus()
        } else {
            document.getElementById('emailInput')?.focus()
        }
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
            
            <h2 className={`text-center ${isDarkMode ? 'text-white' : ''}`}
                style={{
                    fontSize: isMobile ? '1.7rem' : '2rem',
                    textShadow: '0 0 1px gray'
                }}
            >
                {isRegister ? "REGISTRARSE" : "INGRESAR"}
            </h2>

            <Container style={{ padding: isMobile ? '35px 30px 0' : '35px 0 0', maxWidth: '500px' }}>

                <FloatingLabel
                    label={"Correo electrónico"}
                    className={'mb-3 text-dark'}
                    >
                    <Form.Control
                        autoComplete={'email'}
                        className={'form-control'}
                        id={"emailInput"}
                        onChange={(e: any) => setEmail((e.target as HTMLInputElement).value)}
                        placeholder={"Correo electrónico"}
                        type={'email'}
                        value={email}
                    />
                </FloatingLabel>

                <FloatingLabel
                    label={"Contraseña"}
                    className={'mb-3 text-dark'}
                >
                    <Form.Control
                        className={'form-control'}
                        id={"passwordInput"}
                        onChange={(e: any) => setPassword((e.target as HTMLInputElement).value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && !isRegister ? loginHandler() : null }
                        placeholder={"Contraseña"}
                        type={'password'}
                        value={password}
                    />
                </FloatingLabel>

                {isRegister && <>

                    <FloatingLabel
                        label={"Confirmar Contraseña"}
                        className={'mb-3 text-dark'}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'password'}
                            value={confPassword}
                            placeholder={"Confirmar Contraseña"}
                            onChange={(e: any) => setConfPassword((e.target as HTMLInputElement).value)}
                        />
                    </FloatingLabel>

                    <FloatingLabel
                        label={"Número de Grupo de Predicación"}
                        className={'mb-3 text-dark'}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'number'}
                            value={group ? group : ''}
                            min={'1'}
                            placeholder={"Número de Grupo de Predicación"}
                            onChange={(e: any) => setGroup((e.target as any).value)}
                            onKeyDown={(e: any) => e.key === 'Enter' ? loginHandler() : null }
                        />
                    </FloatingLabel>

                </>}

                <button
                    className={`btn ${isRegister ? 'btn-general-red' : 'btn-general-blue'} btn-block mt-3`}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => isRegister ? registerHandler() : loginHandler()}
                >
                    {isRegister ? "REGISTRARSE" : "ENTRAR"}
                </button>


                <a className={'d-block text-end'} href={'#top'}
                    style={{
                        fontSize: '1rem',
                        margin: '18px 0 10px 0'
                    }}
                    onClick={() => {
                        clearInputs()
                        setIsRegister(x => !x)
                    }}
                >
                    {isRegister ? "Volver a ingreso" : "Registrar una cuenta"}
                </a>

                <a className={'d-block text-end'} href={'#top'}
                    style={{
                        fontSize: '1rem',
                        margin: '0 0 22px'
                    }}
                    onClick={() => {
                        if (email && email.includes('@') && email.includes('.')) openConfirmModalHandler()
                        else openAlertModalHandler("Escribir el email primero", "")
                    }}
                >
                    Olvidé mi contraseña
                </a>
                
            </Container>


        </Container>

        {isRegister &&
            <p className={`text-center mb-4 ${isDarkMode ? 'text-white' : ''}`}
                style={{ fontSize: '0.9rem', paddingBottom: '12px' }}>
                Luego de registrarse, se debe aguardar la autorización del grupo de territorios
            </p>
        }

        {loading && <Loading />}
    </>)
}
