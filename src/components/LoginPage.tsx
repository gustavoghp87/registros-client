import React, { useState, useEffect } from 'react';
// import { Button } from 'react-bootstrap';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, log } from '../_actions/user_actions';
import { RootState } from '../_reducers/index';
import { SERVER } from "../config.json";
import { useHistory } from 'react-router-dom';


function LoginPage() {

    const history = useHistory();

    const [Mobile, setMobile] = useState(false);
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('')

    useEffect(() => {
        if (window.screen.width<=767) {setMobile(true)};
    }, [Mobile])

    // let presentation = Mobile ? {background:'red'} : {background:'green'};

    const loginHandle = async () => {
        console.log("log in...");
        const axios = await Axios.post(`${SERVER}/api/users/login`, {email, password});
        const loginSuccess = axios.data.loginSuccess;
        console.log(loginSuccess);
        
        if (loginSuccess) {
            history.push("/home");
        } else {
            alert("Datos incorrectos");
        }
    };
    

    // Axios.post(`${SERVER}/post`, {data:{dato:"ok"}})
    //     .then( resp => {console.log("All right", resp)} );

    setTimeout(() => {if (window.screen.width<=767) {setMobile(true)}; console.log("Mobile", Mobile);}, 1000)

    const counter = useSelector((state:RootState) => state.counter);
    const login = useSelector((state:RootState) => state.login);
    const dispatch = useDispatch();
    
    
    return (

        <div className="container" style={{maxWidth:'95%'}}>

            <div className="container" style={{paddingTop:'30px', marginBottom:'50px', border:'black 1px solid', borderRadius:'12px', maxWidth:'600px'}}>
            
                <div className="row" style={{marginBottom:'0px'}}>
                    <h2 style={{display:'block', margin:'auto'}}>
                        INGRESAR
                    </h2>
                    <br/>
                </div>

                {/* <script src="https://www.google.com/recaptcha/api.js"></script>
                <script>
                    function onSubmit(token) { document.getElementById("demo-form").submit(); };
                </script> */}

                <div className="container" style={{paddingTop:'15px', display:'block', margin:'auto', maxWidth:'500px'}}>



                    <div style={{display:'block', margin:'auto'}} id="demo-form">

                        <input className="form-control" type="email" name="email" style={{marginBottom:'12px'}} placeholder="Correo electrónico" autoFocus onChange={e => setemail((e.target as HTMLInputElement).value)} />

                        <input className="form-control" type="password" name="password" style={{marginBottom:'30px'}} placeholder="Contraseña" onChange={e => setpassword((e.target as HTMLInputElement).value)} />

                        <button
                            className="btn btn-success g-recaptcha"
                            style={{width:'100%', display:'block', margin:'auto'}}
                            data-sitekey="6LefBLcZAAAAANjU9eswkE-TMmarZL72OzW_ZlSz"
                            data-callback='onSubmit'
                            data-action='submit'
                            onClick={()=>loginHandle()}
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


            <h2 style={{textAlign:'center'}}> All right! </h2>

            <br/><br/>

            <h1>Contador: {counter}</h1>

            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(decrement(1))}>-1</button>
            <button onClick={() => dispatch(decrement(2))}>-2</button>

            {login ? <h2>Está logueado</h2> : <h2>No está logueado</h2>}

            <button onClick={() => dispatch(log())}>LogIn/LogOut</button>

        </div>
    )
};


export default LoginPage;
