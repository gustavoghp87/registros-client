import React, { useState } from 'react'
import { SERVER } from "../config"
import { Link, useHistory } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { mobile } from './_App'
import { Form } from 'react-bootstrap'


function LoginPage() {

    const history = useHistory()
    const [email, setemail] = useState<any>(localStorage.getItem('rememberMeMW') ? localStorage.getItem('rememberMeMW') : '')
    const [password, setpassword] = useState<any>(localStorage.getItem('rememberMePSMW') ? localStorage.getItem('rememberMePSMW') : '')
    const { executeRecaptcha } = useGoogleReCaptcha()
    const rememberMeMWChecked = localStorage.getItem("rememberMeMW") ? true : false
    const [rememberMeMW, setRememberMeMW] = useState(rememberMeMWChecked)


    const loginHandle = async () => {
        if (!executeRecaptcha) return
        const recaptchaToken = await executeRecaptcha("")
        //console.log(recaptchaToken)
        let axios, loginSuccess
        const fetchy = await fetch(`${SERVER}/api/users/login`, {
            method: 'POST',
            headers: {'Content-Type':'application/json', 'Accept':'application/json'},
            body: JSON.stringify({email, password, recaptchaToken})
        })
        axios = await fetchy.json()
        loginSuccess = axios.loginSuccess
        const token = axios.newtoken;
        document.cookie = `newtoken = ${token}`
        //console.log("Éxito en loguear:", loginSuccess, "doc.cookie:", document.cookie)

        if (loginSuccess) {
            if (rememberMeMW) {
                localStorage.setItem('rememberMeMW', email)
                localStorage.setItem('rememberMePSMW', password)
            } else {
                localStorage.removeItem('rememberMeMW')
                localStorage.removeItem('rememberMePSMW')
            }
            history.push("/index")
        }
        else if (axios.recaptchaFails) alert("Problemas, refresque la página")
        else if (axios.disable) alert("Usuario aun no habilitado por el grupo de territorios... avisarles")
        else {alert("Datos incorrectos"); window.location.reload()}
    }

    
    const loginHandle2 = (e:any) => {if (e.key === 'Enter') loginHandle()}

    
    return (

        <div className="container" style={{maxWidth:'100%', marginTop:'50px', padding:'0'}}>

            <div className="container" style={{paddingTop:'50px', marginBottom:'50px', border:'black 1px solid', borderRadius:'12px', maxWidth:'600px', boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
            
                <h2 style={{textAlign:'center', textShadow:'0 0 1px gray', fontSize: mobile ? '1.7rem' : '2rem'}}> INGRESAR </h2>

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
                            onKeyDown={(es)=> loginHandle2(es)}
                        />

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Recordarme" checked={rememberMeMW}
                                onChange={ () => {setRememberMeMW(!rememberMeMW)} }
                            />
                        </Form.Group>

                        <button
                            className="btn btn-success"
                            style={{width:'100%', display:'block', margin:'auto'}}
                            onClick={()=>loginHandle()}
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


export default LoginPage
