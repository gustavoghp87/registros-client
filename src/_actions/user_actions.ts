import Axios from 'axios';
import { INCREMENT, DECREMENT, LOG_IN, AUTH_USER } from './types';
import { SERVER } from '../config.json';
const NODE_ENV = process.env.NODE_ENV;


export const increment = () => {
    return {
        type: INCREMENT
    };
};

export const decrement = (nr:number) => {
    return {
        type: DECREMENT,
        payload: nr
    };
};

export const log = () => {
    return {
        type: LOG_IN
    };
};

export const auth = async () => {
    if (NODE_ENV==="development") {
        const axios = await Axios(`${SERVER}/api/users/auth`, {withCredentials:true})
        const request = axios.data;  // pack usuario

        return {
            type: AUTH_USER,
            payload: request
        };
    } else {
        const axios = await Axios(`${SERVER}/api/users/auth`)
        const request = axios.data;  // pack usuario

        return {
            type: AUTH_USER,
            payload: request
        };
    }
};


// las acciones son objetos. La función que retorna es una manera de llamar al objeto.

// redux-thunk habilita a convertir estas funciones en funciones que hacen más cosas, como llamar al servidor para obtener datos
