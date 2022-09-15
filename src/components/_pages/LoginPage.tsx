import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { FormLayout, Loading } from '../commons'
import { logoutReducer, refreshUserReducer, setValuesAndOpenAlertModalReducer } from '../../store'
import { getFailingEmailFromLSService, setFailingEmailToLSService } from '../../services'
import { getUserByTokenService1, loginService, registerUserService, sendLinkToRecoverAccount } from '../../services/userServices'
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

    const openAlertModalHandler = (title: string, message: string, animation: number, execution?: Function): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation,
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
        else openAlertModalHandler("Escribir el email primero", "", 2)
    }

    const sendForgotPswEmailHandler = async (): Promise<void> => {
        setLoading(true)
        const response = await sendLinkToRecoverAccount(email)
        if (response && response.success) openAlertModalHandler(`Se envió un correo a ${email}`, "", 1)
        else if (response && response.noUser) openAlertModalHandler("Este email no es de un usuario registrado:", `${email}`, 2)
        else if (response && response.notSent) openAlertModalHandler("Algo falló", `No se pudo mandar un correo a ${email}`, 2)
        else openAlertModalHandler("Algo falló", "", 2)
        setLoading(false)
    }

    const loginHandler = async (): Promise<void> => {
        if (email.length === 0 || password.length < 6) return openAlertModalHandler("Problemas", "Faltan datos", 2)
        if (!executeRecaptcha) return
        const recaptchaToken: string = await executeRecaptcha()
        if (!recaptchaToken) return openAlertModalHandler("Problemas (1)", "Refrescar la página", 2)
        setLoading(true)
        const response: typeResponseData|null = await loginService(email, password, recaptchaToken)
        setLoading(false)
        if (response && response.success && response.newToken) {
            const user0: typeUser|false|null = await getUserByTokenService1(response.newToken)
            if (user0 === false) dispatch(logoutReducer())
            if (!user0) return openAlertModalHandler("Problemas (2)", "Refrescar la página; ver si hay internet", 2)
            dispatch(refreshUserReducer(user0))
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

    const registerHandler = async (): Promise<void> => {
        setLoading(true)
        if (!email || !password || !confPassword || !group)
            return openAlertModalHandler("Problemas", "Faltan datos", 2)
        if (password.length < 8)
            return openAlertModalHandler("Problemas", "La contraseña es demasiado corta (mínimo 8)", 2)
        if (password !== confPassword)
            return openAlertModalHandler("Problemas", "La contraseña no coincide con su confirmación", 2)
        if (!executeRecaptcha)
            return openAlertModalHandler("Problemas", "Se refrescará la página por un problema", 2, () => window.location.reload())
        executeRecaptcha().then(async (recaptchaToken: string) => {
            if (!recaptchaToken)
                return openAlertModalHandler("Problemas", "Se refrescará la página por un problema", 2, () => window.location.reload())
            const data: typeResponseData|null = await registerUserService(email, password, group, recaptchaToken)
            if (!data) {
                openAlertModalHandler("Problemas", "Algo salió mal", 2, () => window.location.reload())
            } else if (data.recaptchaFails) {
                openAlertModalHandler("Problemas", "Se refrescará la página por un problema", 2, () => window.location.reload())
            } else if (data.userExists) {
                openAlertModalHandler("Problemas", "Ya existe un usuario con ese correo", 2, () => navigate('/acceso'))
            } else if (data.success) {
                openAlertModalHandler("Registro exitoso", `Resta ser habilitado por el grupo de predicación. ${email}`, 1, () => navigate('/'))
            } else {
                openAlertModalHandler("Respuesta desconocida", `Algo falló. ${email}`, 2, () => navigate('/'))
            }
        })
    }

    useEffect(() => {
        const failingEmail: string|null = getFailingEmailFromLSService()
        if (!failingEmail) return document.getElementById('emailInput')?.focus()
        setEmail(failingEmail)
        document.getElementById('passwordInput')?.focus()
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
