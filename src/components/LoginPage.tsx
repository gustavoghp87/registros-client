import React, { useState, useEffect } from 'react'
import { SERVER } from "../config.json"
import { useHistory } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'


function LoginPage() {

    const history = useHistory()
    const [email, setemail] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [recaptchaToken, setRecaptchaToken ] = useState<string|null>('')
    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        (async () => {
            if (!executeRecaptcha) return
            const result = await executeRecaptcha("");
            setRecaptchaToken(result);
        })()
    }, [executeRecaptcha])

    const loginHandle = async () => {
        let axios, loginSuccess
        const fetchy = await fetch(`${SERVER}/api/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email, password, recaptchaToken})
        })
        axios = await fetchy.json()
        loginSuccess = axios.loginSuccess
        const token = axios.newtoken;
        document.cookie = `newtoken = ${token}`
        console.log("Éxito en loguear:", loginSuccess, "doc.cookie:", document.cookie)

        if (loginSuccess) history.push("/index")
        else if (axios.recaptchaFails) alert("Problemas, refresque la página")
        else if (axios.disable) alert("Usuario aun no habilitado por el grupo de territorios... avisarles")
        else alert("Datos incorrectos")
    }

    const loginHandle2 = (e:any) => {
        if (e.key === 'Enter')
            loginHandle()
    }

    
    return (

        <div className="container" style={{maxWidth:'95%', marginTop:'50px'}}>

            <div className="container" style={{paddingTop:'50px', marginBottom:'50px', border:'black 1px solid', borderRadius:'12px', maxWidth:'600px', boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
            
                <h2 style={{textAlign:'center', textShadow:'0 0 1px gray'}}> INGRESAR </h2>

                <div className="container" style={{paddingTop:'35px', display:'block', margin:'auto', maxWidth:'500px'}}>

                    <div style={{display:'block', margin:'auto'}}>

                        <input className="form-control" type="email" name="email" style={{marginBottom:'12px'}} placeholder="Correo electrónico" autoFocus onChange={e => setemail((e.target as HTMLInputElement).value)} />

                        <input className="form-control" type="password" name="password" style={{marginBottom:'30px'}} placeholder="Contraseña" onChange={e => setpassword((e.target as HTMLInputElement).value)} onKeyDown={(es)=> loginHandle2(es)} />

                        <button
                            className="btn btn-success"
                            style={{width:'100%', display:'block', margin:'auto'}}
                            onClick={()=>loginHandle()}
                        >
                            ENTRAR
                        </button>

                    </div>


                    <a href={"/register"}>
                        <p style={{fontSize:'1rem', margin:'15px 0 30px', textAlign:'end'}}>
                            Registrar una cuenta
                        </p>
                    </a>
                    
                </div>

            </div>

        </div>
        
    )
}


export default LoginPage
