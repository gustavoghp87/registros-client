import { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FormLayout } from '../commons'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { changePswService, getEmailByEmailLink } from '../../services/userServices'
import { typeAppDispatch } from '../../models'

export const RecoveryPage = () => {

    const { id } = useParams<string>()
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
    const navigate: NavigateFunction = useNavigate()
    const [confPassword, setConfPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const openAlertModalHandler = (title: string, message: string, execution: Function|undefined = undefined): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            execution
        }))
    }
    
    const recoverAccountHandler = async (): Promise<void> => {
        if (!id || !email || !password || !confPassword) return openAlertModalHandler("Faltan datos", "")
        if (password.length < 8) return openAlertModalHandler("La contraseña es demasiado corta (mín 8)", "")
        if (password !== confPassword) return openAlertModalHandler("La contraseña no coincide con su confirmación", "")
        const response = await changePswService(null, password, id)
        if (response && response.success) {
            openAlertModalHandler("Clave cambiada con éxito", "", () => navigate('/'))
        } else if (response && response.expired) {
            openAlertModalHandler("Este link ya expiró; pedir otro", "", () => navigate('/acceso'))
        } else if (response && response.used) {
            openAlertModalHandler("Este link de recuperación ya se usó antes", "", () => navigate('/acceso'))
        } else openAlertModalHandler("Algo salió mal", "")
    }
    
    useEffect(() => {
        if (id && !email) getEmailByEmailLink(id).then((email: string|null) => {
            if (email) setEmail(email)
            else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "El link no es válido",
                    message: "",
                    execution: () => navigate('/')
                }))
            }
        })
    }, [dispatch, email, id, navigate])

    return (
        <FormLayout
            acceptButtonLabel={"CAMBIAR CLAVE"}
            action={recoverAccountHandler}
            email={email}
            confPassword={confPassword}
            isRecovery={true}
            password={password}
            setConfPassword={setConfPassword}
            setEmail={setEmail}
            setPassword={setPassword}
            title={"CAMBIAR LA CLAVE PARA RECUPERAR LA CUENTA"}
        />
    )
}
