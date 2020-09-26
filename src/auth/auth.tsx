import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";


export default function (ComposedClass:any, reload:boolean) {

    function AuthenticationCheck(props:any) {

        let user = useSelector((state:any) => state.user);
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(async response => {
                console.log("AUTHENTICATION", response.payload.userData.isAuth, "&&", reload);
                if (!response.payload.userData.isAuth && reload) {
                    if (reload) {
                        props.history.push('/login')
                    }
                }
            })
            
        }, [dispatch, props.history])

        return (
            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationCheck
}
