import { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { typeAppDispatch, typeRootState } from '../store/store'
import { useAuth } from '../context/authContext'
import { registerUserService } from '../services/userServices'
import { typeUser } from '../models/user'
import { typeResponseData } from '../models/httpResponse'

export const RegisterPage = () => {

    const user: typeUser|undefined = useAuth().user
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const [group, setGroup] = useState<number>(0)
    const { executeRecaptcha } = useGoogleReCaptcha()
    const { isDarkMode } = useSelector((state: typeRootState) => state.darkMode)
    const { isMobile } = useSelector((state: typeRootState) => state.mobileMode)

    useEffect(() => {
        if (user && user.isAuth) { window.location.href = "/index" }
        return
    }, [user])

    const dispatch: typeAppDispatch = useDispatch()

    const openAlertModalHandler = (title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution
        }))
    }

    const sendFormHandler = async (): Promise<void> => {
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
                    openAlertModalHandler("Problemas", "Ya existe un usuario con ese correo", () => window.location.href = "/login")
                } else if (data.success) {
                    openAlertModalHandler("Registro exitoso", `Resta ser habilitado por el grupo de predicación. ${email}`, () => window.location.href = "/")
                }
            } else {
                openAlertModalHandler("Problemas", "Algo salió mal", () => window.location.reload())
            }
        })
    }

    
    return (
    <>
        <div className={'container'}
            style={{ maxWidth: '95%', marginTop: '50px', padding: '0' }}>

            <div className={`container ${isDarkMode ? 'bg-dark text-white' : ''}`}
                style={{
                    paddingTop: '40px',
                    marginBottom: '40px',
                    border: 'gray 1px solid',
                    borderRadius: '12px',
                    maxWidth: '600px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                }}
            >

                <h2 style={{ textAlign: 'center', textShadow: '0 0 1px gray', fontSize: isMobile ? '1.6rem' : '2rem' }}>
                    REGISTRARSE
                </h2>

                <div className={'container'} style={{ paddingTop: '35px', display: 'block', margin: 'auto', maxWidth: '500px' }}>

                    <input className={'form-control'}
                        type={'email'}
                        style={{ marginBottom: '12px' }}
                        placeholder={"Correo electrónico"}
                        autoFocus
                        onChange={(e: any) => setEmail((e.target as HTMLInputElement).value)}
                    />

                    <input className={'form-control'}
                        type={'password'}
                        style={{ marginBottom: '12px' }}
                        placeholder={'Contraseña'}
                        onChange={(e: any) => setPassword((e.target as HTMLInputElement).value)}
                    />

                    <input className={'form-control'}
                        type={'password'}
                        style={{ marginBottom: '12px' }}
                        placeholder={'Confirmar Contraseña'}
                        onChange={(e: any) => setConfPassword((e.target as HTMLInputElement).value)}
                    />

                    <input className={'form-control'}
                        type={'number'}
                        style={{ marginBottom: '30px' }}
                        min={"1"}
                        placeholder={"Número de Grupo de Predicación"}
                        onChange={(e: any) => setGroup((e.target as any).value)}
                    />

                    <button className={'btn btn-danger'}
                        style={{ width: '100%', height: '50px' }}
                        onClick={() => sendFormHandler()}
                    >
                        REGISTRARSE
                    </button>

                    <Link to={"/login"}>
                        <p style={{ fontSize:'1.1rem', margin: '15px 0 20px 0', textAlign: 'end' }}>
                            Volver a ingreso
                        </p>
                    </Link>

                </div>
            </div>

            <p className={isDarkMode ? 'text-white' : ''}
                style={{ fontSize: '0.9rem', paddingBottom: '12px', textAlign: 'center', display: 'block' }}>
                Luego de registrarse, se debe aguardar la autorización del grupo de territorios
            </p>

        </div>
    </>
    )
}
