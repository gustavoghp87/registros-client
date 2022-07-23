import { Location, useLocation } from 'react-router'
import { Navigate, NavigateFunction, useNavigate } from 'react-router'
import { useAuth } from '../context/authContext'
import { typeUser } from '../models'

export const AdminsRoutes = (props: any) => {
    const user: typeUser|undefined = useAuth().user
    const children = props.children
    console.log("admins", user);
    return <>
        {user && user.isAdmin ?
            children
            :
            <Navigate to={'/index'} />
        }
    </>
}

export const Authenticator = (children: any, isStrictPublic: boolean, isAdminsPrivate: boolean) => {

    const user: typeUser|undefined = useAuth().user
    const navigate: NavigateFunction = useNavigate()
    const location: Location = useLocation()
    const { pathname } = location
    console.log(user, location, pathname)
    

    if (isStrictPublic && user && user.isAuth) navigate('/')

    if (isAdminsPrivate && (!user || !user.isAdmin)) navigate('/')

    return children
}