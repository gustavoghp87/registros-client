import React, { useState, useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import Axios from 'axios';
import { SERVER } from "../config.json";
import { useHistory } from 'react-router-dom'


function RegisterPage() {

    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [group, setGroup] = useState(0)
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [recaptchaToken, setRecaptchaToken] = useState('')

    useEffect(() => {
        (async () => {
            if (!executeRecaptcha) return
            const result = await executeRecaptcha("");
            setRecaptchaToken(result);
        })()
    }, [executeRecaptcha])

    const sendForm = async () => {
        if (!email || !password || !confPassword || !group) return alert("Faltan datos")
        if (password.length<8) return alert("La contraseña es demasiado corta (mín 8)")
        if (password!==confPassword) return alert("La contraseña no coincide con su confirmación")

        const axios:any = await Axios.post(`${SERVER}/api/users/register`, {
            email, password, group, recaptchaToken
        })
        const data = await axios.data
        console.log("Llegó en registrar:", axios)
        if (data.recaptchaFails) alert("Problemas, refresque la página")
        else if (data.userExists) alert("Ya existe un usuario con ese correo")
        else if (data.regSuccess) {
            alert("Registrado con éxito. Resta ser habilitado por el grupo de predicación.")
            history.push("/index")
        }
        else alert("Algo salió mal")
    }


    return (
        <div className="container container2" style={{maxWidth: '95%', marginTop:'50px'}}>

            <div className="container" style={{paddingTop:'30px', marginBottom:'50px', border:'gray 1px solid', borderRadius:'12px', maxWidth:'600px', boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>

                <h2 style={{textAlign:'center', textShadow:'0 0 1px gray'}}> REGISTRARSE </h2>

                <div className="container" style={{paddingTop:'35px', display:'block', margin:'auto', maxWidth:'500px'}}>

                    <input className="form-control" type="email" style={{marginBottom:'12px'}} placeholder="Correo electrónico" autoFocus onChange={e => setEmail((e.target as HTMLInputElement).value)}/>

                    <input className="form-control" type="password" style={{marginBottom:'12px'}} placeholder="Contraseña" onChange={e => setPassword((e.target as HTMLInputElement).value)} />

                    <input className="form-control" type="password" style={{marginBottom:'12px'}} placeholder="Confirmar Contraseña" onChange={e => setConfPassword((e.target as HTMLInputElement).value)} />

                    <input className="form-control" type="number" style={{marginBottom: '30px'}} min="1" placeholder="Número de Grupo de Predicación" onChange={e => setGroup((e.target as any).value)} />

                    <button className="btn btn-danger"
                        style={{width:'100%', height:'50px'}}
                        onClick={()=>sendForm()}>
                        REGISTRARSE
                    </button>

                    <a href={"/login"}>
                        <p style={{fontSize:'1.1rem', margin:'15px 0 20px 0', textAlign:'end'}}>
                            Volver a ingreso
                        </p>
                    </a>

                </div>
            </div>

            <p style={{fontSize:'0.9rem', paddingBottom:'12px', textAlign:'center', display:'block'}}>
                Luego de registrarse, se debe aguardar la autorización del grupo de territorios
            </p>

        </div>
    )
}


export default RegisterPage
