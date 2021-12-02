import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { confirmAlert } from 'react-confirm-alert'
import { loginService } from '../services/tokenServices'
import { isMobile } from '../services/functions'
import { typeUser } from '../models/typesUsuarios'
import { sendLinkToRecoverAccount } from '../services/userServices'

export const LoginPage = (props: any) => {

    const user: typeUser = props.user
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [email, setemail] = useState<string>("")
    const [password, setpassword] = useState<string>("")

    useEffect(() => {
        if (user && user.isAuth) window.location.href = "/index"
    }, [user])
    
    const loginHandler = async (): Promise<void> => {
        if (email.length === 0 || password.length < 6) return
        if (!executeRecaptcha) return
        const recaptchaToken = await executeRecaptcha("")
        const response: any|null = await loginService(email, password, recaptchaToken)
        if (response && response.success && response.newToken)
            window.location.href = "/index"
        else if (!response || response.recaptchaFails) alert("Problemas, refresque la página")
        else if (response && response.isDisabled) alert("Usuario aun no habilitado por el grupo de territorios... avisarles")
        else { alert("Datos incorrectos"); window.location.reload() }
    }

    const resetPasswordHandler = (email: string): void => {
        confirmAlert({
            title: `¿Recuperar cuenta?`,
            message: `Esto enviará un correo a ${email} para cambiar la contraseña`,
            buttons: [
                {
                    label: 'ENVIAR',
                    onClick: () => sendEmail()
                },
                {
                    label: 'CANCELAR',
                    onClick: () => {}
                }
            ]
        })

        const sendEmail = async (): Promise<void> => {
            const response: any = await sendLinkToRecoverAccount(email)
            if (response && response.success)
                alert(`Se envió un correo a ${email}`)
            else if (response && response.noUser)
                alert(`Este email no es de un usuario registrado: ${email}`)
            else if (response && response.notSent)
                alert(`No se pudo mandar un correo a ${email}`)
            else
                alert(`Algo falló`)
        }
    }

    const containerLogin = {
        paddingTop: '50px', marginBottom: '50px', border: 'black 1px solid', borderRadius: '12px',
        maxWidth: '600px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
    
    return (

        <div className="container" style={{ maxWidth: '100%', marginTop: '50px', padding: '0' }}>

            <div className="container" style={containerLogin}>
            
                <h2 style={{ textAlign: 'center', textShadow: '0 0 1px gray', fontSize: isMobile ? '1.7rem' : '2rem' }}>
                    INGRESAR
                </h2>

                <div className="container" style={{ paddingTop: '35px', display: 'block', margin: 'auto', maxWidth: '500px' }}>

                    <div style={{ display: 'block', margin: 'auto' }}>

                        <input className="form-control" type="email" name="email"
                            value={email}
                            style={{ marginBottom: '12px' }}
                            placeholder="Correo electrónico"
                            //minLength={4}
                            autoFocus
                            onChange={(e: any) => setemail((e.target as HTMLInputElement).value)}
                        />

                        <input className="form-control" type="password" name="password"
                            value={password}
                            style={{ marginBottom: '30px' }}
                            placeholder="Contraseña"
                            //minLength={6}
                            onChange={(e: any) => setpassword((e.target as HTMLInputElement).value)}
                            onKeyDown={(es: any) => { if (es.key === 'Enter') loginHandler() }}
                        />

                        {/* <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Recordarme" checked={rememberMeMW}
                                onChange={() => {setRememberMeMW(!rememberMeMW)}}
                            />
                        </Form.Group> */}

                        <button
                            className="btn btn-success"
                            style={{ width: '100%', height: '50px', display: 'block', margin: 'auto' }}
                            onClick={() => loginHandler()}
                        >
                            ENTRAR
                        </button>

                    </div>

                    <Link to={"/register"}>
                        <p style={{ fontSize: '1rem', margin: '18px 0 10px 0', textAlign: 'end' }}>
                            Registrar una cuenta
                        </p>
                    </Link>

                    <a href={"#top"}>
                        <p
                            style={{ fontSize: '1rem', margin: '0px 0 22px', textAlign: 'end' }}
                            onClick={() => {
                                if (email && email.includes("@") && email.includes(".")) resetPasswordHandler(email)
                                else alert("Escribir el email primero")
                            }}
                        >
                            Olvidé mi contraseña
                        </p>
                    </a>
                    
                </div>
            </div>
        </div>
    )
}
