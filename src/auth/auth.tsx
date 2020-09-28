import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";


export default function (ComposedClass:any, reload:boolean) {

    function AuthenticationCheck(props:any) {

        let user = useSelector((state:any) => state.user);
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(async response => {

                console.log("USUARIO EN AUTH", response.payload.userData);
                console.log("AUTHENTICATION, auth", response.payload.userData.isAuth, "&& requerido", reload);

                if (!response.payload.userData.isAuth && reload) 
                    props.history.push('/login');
            })

        }, [dispatch, props.history])

        return (
            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationCheck
}
