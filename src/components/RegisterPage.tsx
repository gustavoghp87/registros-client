import { useEffect, useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Link } from 'react-router-dom'
import { typeUser } from '../models/typesUsuarios'
import { isMobile } from '../services/functions'
import { registerUserService } from '../services/userServices'

export const RegisterPage = (props: any) => {

    const user: typeUser = props.user
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const [group, setGroup] = useState<number>(0)
    const [recaptchaToken, setRecaptchaToken] = useState<string>('')
    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        if (user && user.isAuth) window.location.href = "/"
    }, [user])

    const sendFormHandler = async (): Promise<void> => {
        if (!executeRecaptcha) return
        const token: string = await executeRecaptcha("")
        if (token) setRecaptchaToken(token)
        if (!email || !password || !confPassword || !group) return alert("Faltan datos")
        if (password.length < 8) return alert("La contraseña es demasiado corta (mín 8)")
        if (password !== confPassword) return alert("La contraseña no coincide con su confirmación")
        if (recaptchaToken) sendForm()
    }

    const sendForm = async (): Promise<void> => {
        const data: any|null = await registerUserService(email, password, group, recaptchaToken)
        if (data) {
            if (data.recaptchaFails) alert("Problemas, refresque la página")
            else if (data.userExists) alert("Ya existe un usuario con ese correo")
            else if (data.success) {
                alert("Registrado con éxito. Resta ser habilitado por el grupo de predicación.")
                window.location.href = "/"
            }
        }
        else alert("Algo salió mal")
    }

    
    return (
        <div className="container container2" style={{maxWidth:'95%', marginTop:'50px', padding:'0'}}>

            <div className="container" style={{
                paddingTop:'40px', marginBottom:'40px', border:'gray 1px solid', borderRadius:'12px', maxWidth:'600px',
                boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}>

                <h2 style={{textAlign:'center', textShadow:'0 0 1px gray', fontSize: isMobile ? '1.6rem' : '2rem'}}>
                    REGISTRARSE
                </h2>

                <div className="container" style={{paddingTop:'35px', display:'block', margin:'auto', maxWidth:'500px'}}>

                    <input className="form-control"
                        type="email"
                        style={{marginBottom: '12px'}}
                        placeholder="Correo electrónico"
                        autoFocus
                        onChange={e => setEmail((e.target as HTMLInputElement).value)}
                    />

                    <input className="form-control"
                        type="password"
                        style={{marginBottom: '12px'}}
                        placeholder="Contraseña"
                        onChange={e => setPassword((e.target as HTMLInputElement).value)}
                    />

                    <input className="form-control"
                        type="password"
                        style={{marginBottom: '12px'}}
                        placeholder="Confirmar Contraseña"
                        onChange={e => setConfPassword((e.target as HTMLInputElement).value)}
                    />

                    <input className="form-control"
                        type="number"
                        style={{marginBottom: '30px'}}
                        min="1"
                        placeholder="Número de Grupo de Predicación"
                        onChange={e => setGroup((e.target as any).value)}
                    />

                    <button className="btn btn-danger"
                        style={{width:'100%', height:'50px'}}
                        onClick={() => sendFormHandler()}
                    >
                        REGISTRARSE
                    </button>

                    <Link to={"/login"}>
                        <p style={{fontSize:'1.1rem', margin:'15px 0 20px 0', textAlign:'end'}}>
                            Volver a ingreso
                        </p>
                    </Link>

                </div>
            </div>

            <p style={{fontSize:'0.9rem', paddingBottom:'12px', textAlign:'center', display:'block'}}>
                Luego de registrarse, se debe aguardar la autorización del grupo de territorios
            </p>

        </div>
    )
}
