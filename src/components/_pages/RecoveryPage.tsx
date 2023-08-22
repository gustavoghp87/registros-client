import { changePswService, getEmailByEmailLink } from '../../services/userServices'
import { FormLayout } from '../commons'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const RecoveryPage = () => {
    // const { id } = useParams<string>()
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(urlSearchParams.entries());
    const id = queryParams.id;
    const team = queryParams.team;

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [confPassword, setConfPassword] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const openAlertModalHandler = (title: string, message: string, animation?: number, execution?: Function): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation,
            execution
        }))
    }
    
    const recoverAccountHandler = async (): Promise<void> => {
        if (!team || !id || !email || !password || !confPassword) return openAlertModalHandler("Faltan datos", "")
        if (password.length < 8) return openAlertModalHandler("La contraseña es demasiado corta (mín 8)", "")
        if (password !== confPassword) return openAlertModalHandler("La contraseña no coincide con su confirmación", "")
        const congr = parseInt(team)
        if (isNaN(congr)) return openAlertModalHandler("Hay un error en los datos", "")
        const response = await changePswService(congr, null, password, id)
        if (response && response.success) {
            openAlertModalHandler("Clave cambiada con éxito", "", 1, () => navigate('/'))
        } else if (response && response.expired) {
            openAlertModalHandler("Este link ya expiró; pedir otro", "", 2, () => navigate('/acceso'))
        } else if (response && response.used) {
            openAlertModalHandler("Este link de recuperación ya se usó antes", "", 2, () => navigate('/acceso'))
        } else openAlertModalHandler("Algo salió mal", "", 2)
    }
    
    useEffect(() => {
        if (id && team && !email) getEmailByEmailLink(team, id).then((email: string|null) => {
            if (email) setEmail(email)
            else {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "El link no es válido",
                    message: "",
                    execution: () => navigate('/'),
                    animation: 2
                }))
            }
        })
    }, [dispatch, email, id, navigate, team])

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
