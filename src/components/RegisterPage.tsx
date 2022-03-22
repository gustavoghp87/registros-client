import { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link } from 'react-router-dom'
import { ConfirmAlert } from './commons/ConfirmAlert'
import { useAuth } from '../context/authContext'
import { registerUserService } from '../services/userServices'
import { isMobile } from '../services/functions'
import { typeUser } from '../models/typesUsuarios'

export const RegisterPage = (props: any) => {

    const user: typeUser|undefined = useAuth().user
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const [group, setGroup] = useState<number>(0)
    const [recaptchaToken, setRecaptchaToken] = useState<string>('')
    const [showConfirmAlert, setShowConfirmAlert] = useState<boolean>(false)
    const [alertText, setAlertText] = useState<[string, string]>(["", ""])
    const isDarkMode: string = props.isDarkMode
    const { executeRecaptcha } = useGoogleReCaptcha()

    useEffect(() => {
        if (user && user.isAuth) window.location.href = "/index"
        if (executeRecaptcha) setTimeout(() => executeRecaptcha().then((token0: string) => setRecaptchaToken(token0)), 29000)
        return () => setShowConfirmAlert(false)
    }, [user, executeRecaptcha])

    const sendFormHandler = async (): Promise<void> => {
        if (!email || !password || !confPassword || !group) {
            setAlertText(["Problemas", "Faltan datos"])
            setShowConfirmAlert(true)
        } else if (password.length < 8) {
            setAlertText(["Problemas", "La contraseña es demasiado corta (mínimo 8)"])
            setShowConfirmAlert(true)
        } else if (password !== confPassword) {
            setAlertText(["Problemas", "La contraseña no coincide con su confirmación"])
            setShowConfirmAlert(true)
        } else if (recaptchaToken) sendForm()
    }

    const sendForm = async (): Promise<void> => {
        const data: any = await registerUserService(email, password, group, recaptchaToken)
        if (data) {
            if (data.recaptchaFails) setAlertText(["Problemas", "Se refrescará la página por un problema"])
            else if (data.userExists) setAlertText(["Problemas", "Ya existe un usuario con ese correo"])
            else if (data.success) setAlertText(["Registro exitoso", `Resta ser habilitado por el grupo de predicación. ${email}`])
        }
        else setAlertText(["Problemas", "Algo salió mal"])
        setShowConfirmAlert(true)
    }

    const setShowConfirmAlertHandler = (): void => {
        setShowConfirmAlert(false)
        if (alertText[0] === "Registro exitoso") window.location.href = "/"
        else if (alertText[1] === "Ya existe un usuario con ese correo") window.location.href = "/login"
        else if (alertText[1] === "Algo salió mal") window.location.reload()
    }

    
    return (
    <>
        {showConfirmAlert &&
            <ConfirmAlert
                title={alertText[0]}
                message={alertText[1]}
                execution={setShowConfirmAlertHandler}
                cancelAction={null}
            />
        }

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
                        placeholder='Confirmar Contraseña'
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
