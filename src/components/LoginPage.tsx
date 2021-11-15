import { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { autoLoginService, loginService } from '../services/userServices'
import { isMobile } from '../services/functions'

export const LoginPage = () => {

    const { executeRecaptcha } = useGoogleReCaptcha()
    const history = useHistory()
    const [email, setemail] = useState<string>("")
    const [password, setpassword] = useState<string>("")

    useEffect(() => {
        (async () => {
            const result: boolean = await autoLoginService()
            if (result) history.push("/index")
        })()
    })
    
    const loginHandler = async () => {
        if (!executeRecaptcha) return
        const recaptchaToken = await executeRecaptcha("")
        const response: any|null = await loginService(email, password, recaptchaToken)
        if (response && response.success && response.newtoken) {
            history.push("/index")
        }
        else if (!response || response.recaptchaFails) alert("Problemas, refresque la página")
        else if (response && response.disable) alert("Usuario aun no habilitado por el grupo de territorios... avisarles")
        else { alert("Datos incorrectos"); window.location.reload() }
    }

    const loginHandler2 = (e: any) => { if (e.key === 'Enter') loginHandler() }

    const containerLogin = {
        paddingTop:'50px', marginBottom:'50px', border:'black 1px solid', borderRadius:'12px',
        maxWidth:'600px', boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
    }
    
    return (

        <div className="container" style={{maxWidth:'100%', marginTop:'50px', padding:'0'}}>

            <div className="container" style={containerLogin}>
            
                <h2 style={{textAlign:'center', textShadow:'0 0 1px gray', fontSize: isMobile ? '1.7rem' : '2rem'}}>
                    INGRESAR
                </h2>

                <div className="container" style={{paddingTop:'35px', display:'block', margin:'auto', maxWidth:'500px'}}>

                    <div style={{display:'block', margin:'auto'}}>

                        <input className="form-control" type="email" name="email"
                            value={email}
                            style={{marginBottom:'12px'}} placeholder="Correo electrónico" autoFocus
                            onChange={e => setemail((e.target as HTMLInputElement).value)}
                        />

                        <input className="form-control" type="password" name="password"
                            value={password}
                            style={{marginBottom:'30px'}} placeholder="Contraseña"
                            onChange={e => setpassword((e.target as HTMLInputElement).value)}
                            onKeyDown={es => loginHandler2(es)}
                        />

                        {/* <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Recordarme" checked={rememberMeMW}
                                onChange={() => {setRememberMeMW(!rememberMeMW)}}
                            />
                        </Form.Group> */}

                        <button
                            className="btn btn-success"
                            style={{width:'100%', display:'block', margin:'auto'}}
                            onClick={() => loginHandler()}
                        >
                            ENTRAR
                        </button>

                    </div>


                    <Link to={"/register"}>
                        <p style={{fontSize:'1rem', margin:'15px 0 30px', textAlign:'end'}}>
                            Registrar una cuenta
                        </p>
                    </Link>
                    
                </div>
            </div>
        </div>
    )
}
