import React from 'react';
import { Button } from 'react-bootstrap';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, log } from '../_actions/user_actions';
import { RootState } from '../_reducers/index';
import { SERVER } from "../config.json";


function RegisterPage() {
    
    
    return (
        <div className="container container2" style={{maxWidth: '95%'}}>

            <div className="container" style={{paddingTop: '30px', marginBottom: '50px', border: 'black 1px solid', borderRadius: '12px', maxWidth: '600px'}}>

                <div className="row" style={{marginBottom: '0px'}}>
                    <h2 style={{display:'block', margin:'auto'}}>
                    REGISTRARSE
                    </h2>
                    <br/>
                </div>

                <div className="container" style={{paddingTop: '15px', display: 'block', margin: 'auto', maxWidth: '500px'}}>
                    <form action="/register" method="POST" style={{display: 'block', margin: 'auto'}} id="demo-form">
                        <input className="form-control" type="email" name="email" style={{marginBottom: '12px'}} placeholder="Correo electrónico" autoFocus />
                        <input className="form-control" type="password" name="password" style={{marginBottom: '12px'}} placeholder="Contraseña" />
                        <input className="form-control" type="password" name="confpassword" style={{marginBottom: '12px'}} placeholder="Confirmar Contraseña" />
                        <input className="form-control" type="number" name="group" style={{marginBottom: '30px'}} placeholder="Número de Grupo" />
                        <button className="btn btn-danger g-recaptcha" style={{width: '100%', display: 'block', margin: 'auto', height: '50px'}} data-sitekey="6LefBLcZAAAAANjU9eswkE-TMmarZL72OzW_ZlSz" data-callback="onSubmit" data-action="submit">
                            REGISTRARSE
                        </button>

                        <a href={"/login"}>
                            <p style={{fontSize:'1.1rem', padding:'15px 0px', textAlign:'end'}}>
                                Volver a ingreso
                            </p>
                        </a>

                    </form>
                </div>
            </div>

            <p style={{fontSize: '0.9rem', paddingBottom: '12px', textAlign: 'center', display: 'block'}}>
                Luego de registrarse, se debe aguardar la autorización del grupo de territorios
            </p>
            
            <br /><br /><br /><br /><br />

        </div>
    )
};


export default RegisterPage;
