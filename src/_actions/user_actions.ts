import { INCREMENT, DECREMENT, LOG_IN } from './types';

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


// las acciones son objetos. La función que retorna es una manera de llamar al objeto.

// redux-thunk habilita a convertir estas funciones en funciones que hacen más cosas, como llamar al servidor para obtener datos
