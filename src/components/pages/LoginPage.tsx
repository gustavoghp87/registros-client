import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useDispatch, useSelector } from 'react-redux'
import { FormLayout, Loading } from '../commons'
import { refreshUserReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { getFailingEmailFromLSService, setFailingEmailFromLSService } from '../../services'
import { getUserByTokenService, loginService, registerUserService, sendLinkToRecoverAccount } from '../../services/userServices'
import { typeAppDispatch, typeResponseData, typeRootState, typeUser } from '../../models'

export const LoginPage = () => {

    const { executeRecaptcha } = useGoogleReCaptcha()
    const { isDarkMode } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [confPassword, setConfPassword] = useState<string>('')
    const [email, setEmail] = useState<string>("")
    const [group, setGroup] = useState<number>(0)
    const [isRegister, setIsRegister] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")

    const openAlertModalHandler = (title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution
        }))
        setLoading(false)
    }

    const recoverAccountHandler = (): void => {
        if (email && email.includes('@') && email.includes('.')) dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Recuperar cuenta?",
            message: `Esto enviará un correo a ${email} para cambiar la contraseña`,
            execution: sendForgotPswEmailHandler
        }))
        else openAlertModalHandler("Escribir el email primero", "")
    }

    const sendForgotPswEmailHandler = async (): Promise<void> => {
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
        const recaptchaToken: string = await executeRecaptcha()
        if (!recaptchaToken) return openAlertModalHandler("Problemas", "Refrescar la página")
        const response: typeResponseData|null = await loginService(email, password, recaptchaToken)
        if (response && response.success && response.newToken) {
            const user0: typeUser|null = await getUserByTokenService(response.newToken)
            if (user0) {
                dispatch(refreshUserReducer(user0))
                return
            }
            openAlertModalHandler("Problemas", "Refrescar la página")
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
            if (!data)
                return openAlertModalHandler("Problemas", "Algo salió mal", () => window.location.reload())
            if (data.recaptchaFails) {
                openAlertModalHandler("Problemas", "Se refrescará la página por un problema", () => window.location.reload())
            } else if (data.userExists) {
                openAlertModalHandler("Problemas", "Ya existe un usuario con ese correo", () => navigate('/acceso'))
            } else if (data.success) {
                openAlertModalHandler("Registro exitoso", `Resta ser habilitado por el grupo de predicación. ${email}`, () => navigate('/'))
            } else {
                openAlertModalHandler("Respuesta desconocida", `Algo falló. ${email}`, () => navigate('/'))
            }
        })
    }

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

        <FormLayout
            action={isRegister ? registerHandler : loginHandler}
            acceptButtonLabel={isRegister ? "REGISTRARSE" : "ENTRAR"}
            email={email}
            confPassword={confPassword}
            group={group}
            isRegister={isRegister}
            password={password}
            recoverAccountHandler={recoverAccountHandler}
            setConfPassword={setConfPassword}
            setEmail={setEmail}
            setGroup={setGroup}
            setIsRegister={setIsRegister}
            setPassword={setPassword}
            title={isRegister ? "REGISTRARSE" : "INGRESAR"}
        />

        {isRegister &&
            <p className={`text-center mb-4 ${isDarkMode ? 'text-white' : ''}`}
                style={{ fontSize: '0.9rem', paddingBottom: '12px' }}>
                Luego de registrarse, se debe aguardar la autorización de los administradores
            </p>
        }

        {loading && <Loading mt={'40px'} />}

    </>)
}
