import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { typeAppDispatch, typeRootState } from '../store/store'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useAuth } from '../context/authContext'
import { sendLinkToRecoverAccount } from '../services/userServices'
import { typeUser } from '../models/user'


export const LoginPage = () => {

    const user: typeUser|undefined = useAuth().user
    const { login } = useAuth()
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    useEffect(() => {
        if (user && user.isAuth) window.location.href = "/index"
        const failingEmail = getFailingEmail()
        if (failingEmail) setEmail(failingEmail)
    }, [user])

    const getFailingEmail = (): string|null => localStorage.getItem("failingEmail")
    const setFailingEmail = (): void => localStorage.setItem("failingEmail", email)

    const dispatch: typeAppDispatch = useDispatch()

    const openAlertModalHandler = (title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution
        }))
    }

    const openConfirmModalHandler = (): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'confirm',
            title: "¿Recuperar cuenta?",
            message: `Esto enviará un correo a ${email} para cambiar la contraseña`,
            execution: sendEmailHandler
        }))
    }
    
    const loginHandler = async (): Promise<void> => {
        if (email.length === 0 || password.length < 6) return
        if (!executeRecaptcha) return
        const recaptchaToken = await executeRecaptcha("")
        if (!login) return openAlertModalHandler("Problemas", "Refrescar la página")
        const response = await login(email, password, recaptchaToken)
        if (response && response.success && response.newToken) {
            window.location.href = "/index"
        } else if (!response || response.recaptchaFails) {
            setFailingEmail()
            openAlertModalHandler("Problemas", "Refrescar la página")
        } else if (response && response.isDisabled) {
            openAlertModalHandler("No habilitado", "Usuario aun no habilitado por el grupo de territorios... avisarles")
        } else {
            setFailingEmail()
            openAlertModalHandler("Datos incorrectos", "", () => window.location.reload())
        }
    }

    const sendEmailHandler = async (): Promise<void> => {
        const response = await sendLinkToRecoverAccount(email)
        if (response && response.success) openAlertModalHandler(`Se envió un correo a ${email}`, "")
        else if (response && response.noUser) openAlertModalHandler("Este email no es de un usuario registrado:", `${email}`)
        else if (response && response.notSent) openAlertModalHandler("Algo falló", `No se pudo mandar un correo a ${email}`)
        else openAlertModalHandler("Algo falló", "")
    }

    
    return (
    <>
        <div className={'container'} style={{ maxWidth: '100%', marginTop: '50px', padding: '0' }}>

            <div className={`container ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{
                    paddingTop: '50px',
                    marginBottom: '50px',
                    border: 'black 1px solid',
                    borderRadius: '12px',
                    maxWidth: '600px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}>
            
                <h2 style={{ textAlign: 'center', textShadow: '0 0 1px gray', fontSize: isMobile ? '1.7rem' : '2rem' }}>
                    INGRESAR
                </h2>

                <div className={'container'} style={{ paddingTop: '35px', display: 'block', margin: 'auto', maxWidth: '500px' }}>

                    <div style={{ display: 'block', margin: 'auto' }}>

                        <input className={'form-control'} type={'email'} name={'email'}
                            value={email}
                            style={{ marginBottom: '12px' }}
                            placeholder={"Correo electrónico"}
                            //minLength={4}
                            autoFocus
                            onChange={(e: any) => setEmail((e.target as HTMLInputElement).value)}
                        />

                        <input className={'form-control'} type={'password'} name={'password'}
                            value={password}
                            style={{ marginBottom: '30px' }}
                            placeholder={"Contraseña"}
                            //minLength={6}
                            onChange={(e: any) => setPassword((e.target as HTMLInputElement).value)}
                            onKeyDown={(e: any) => { if (e.key === 'Enter') loginHandler() }}
                        />

                        {/* <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Recordarme" checked={rememberMeMW}
                                onChange={() => {setRememberMeMW(!rememberMeMW)}}
                            />
                        </Form.Group> */}

                        <button
                            className={'btn btn-success'}
                            style={{ width: '100%', height: '50px', display: 'block', margin: 'auto' }}
                            onClick={() => loginHandler()}
                        >
                            ENTRAR
                        </button>

                    </div>

                    <Link to={"/registro"}>
                        <p style={{ fontSize: '1rem', margin: '18px 0 10px 0', textAlign: 'end' }}>
                            Registrar una cuenta
                        </p>
                    </Link>

                    <a href={"#top"}>
                        <p
                            style={{ fontSize: '1rem', margin: '0px 0 22px', textAlign: 'end' }}
                            onClick={() => {
                                if (email && email.includes("@") && email.includes(".")) openConfirmModalHandler()
                                else openAlertModalHandler("Escribir el email primero", "")
                            }}
                        >
                            Olvidé mi contraseña
                        </p>
                    </a>
                    
                </div>
            </div>
        </div>
    </>
    )
}
