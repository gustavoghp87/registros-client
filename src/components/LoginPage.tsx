import React, { useState } from 'react'
import { SERVER } from "../config.json"
import { useHistory } from 'react-router-dom'


function LoginPage() {

    const history = useHistory()

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const loginHandle = async () => {
        let axios, loginSuccess
        const fetchy = await fetch(`${SERVER}/api/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email, password})
        })
        axios = await fetchy.json()
        loginSuccess = axios.loginSuccess
        const token = axios.newtoken;
        document.cookie = `newtoken = ${token}`

        console.log("Éxito en loguear:", loginSuccess, "doc.cookie:", document.cookie)

        if (loginSuccess) {
            history.push("/index")
        } else {
            alert("Datos incorrectos")
        }
    }

    const loginHandle2 = (e:any) => {
        if (e.key === 'Enter')
            loginHandle()
    }

    
    return (

        <div className="container" style={{maxWidth:'95%'}}>

            <br/> <br/>

            <div className="container" style={{paddingTop:'30px', marginBottom:'50px', border:'black 1px solid', borderRadius:'12px', maxWidth:'600px'}}>
            
                <h2 style={{textAlign:'center'}}> INGRESAR </h2>
                <br/>


                {/* <script src="https://www.google.com/recaptcha/api.js"></script>
                <script>
                    function onSubmit(token) { document.getElementById("demo-form").submit(); };
                </script> */}

                <div className="container" style={{paddingTop:'15px', display:'block', margin:'auto', maxWidth:'500px'}}>



                    <div style={{display:'block', margin:'auto'}} id="demo-form">

                        <input className="form-control" type="email" name="email" style={{marginBottom:'12px'}} placeholder="Correo electrónico" autoFocus onChange={e => setemail((e.target as HTMLInputElement).value)} />

                        <input className="form-control" type="password" name="password" style={{marginBottom:'30px'}} placeholder="Contraseña" onChange={e => setpassword((e.target as HTMLInputElement).value)} onKeyDown={(es)=> loginHandle2(es)} />

                        <button
                            className="btn btn-success g-recaptcha"
                            style={{width:'100%', display:'block', margin:'auto'}}
                            data-sitekey="6LefBLcZAAAAANjU9eswkE-TMmarZL72OzW_ZlSz"
                            data-callback='onSubmit'
                            data-action='submit'
                            onClick={()=>loginHandle()}
                            id="login"
                        >
                            ENTRAR
                        </button>

                    </div>


                    <a href={"/register"}>
                        <p style={{fontSize:'1rem', padding:'15px 0px', textAlign:'end'}}>
                            Registrar una cuenta
                        </p>
                    </a>
                </div>

            </div>

            <br/><br/><br/><br/><br/>

        </div>
        
    )
}


export default LoginPage
