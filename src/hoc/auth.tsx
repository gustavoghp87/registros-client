import React, { useEffect } from 'react'
import { auth } from '../_actions/user_actions'
import { useSelector, useDispatch } from "react-redux"


export default function (ComposedClass:any, reload:boolean, reloadAdmin:boolean=false) {

    function AuthenticationCheck(props:any) {

        let user = useSelector((state:any) => state.user)
        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(auth()).then(async response => {
                if (!response.payload.isAuth && reload) props.history.push('/login')
                if (response.payload.role!==1 && reloadAdmin) props.history.push('/login')
            })
        }, [dispatch, props.history])

        return (
            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationCheck
}
