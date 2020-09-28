//import Axios from 'axios';
import { AUTH_USER } from './types';
import { SERVER } from '../config.json';


export const auth = async () => {

        console.log("Llamando a auth desde desarrollo");

        const axios = await fetch(`${SERVER}/api/users/auth`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({token:document.cookie})
        });
        const request = await axios.json();

        return {
            type: AUTH_USER,
            payload: request
        };

};


// las acciones son objetos. La función que retorna es una manera de llamar al objeto.

// redux-thunk habilita a convertir estas funciones en funciones que hacen más cosas, como llamar al servidor para obtener datos
