import { changePswService, getEmailByEmailLink } from '../../services/userServices'
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { emailPattern } from '../../app-config'
import { setValuesAndOpenAlertModalReducer } from '../../store'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const RecoveryPage = () => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const urlSearchParams = new URLSearchParams(window.location.search)
    const queryParams = Object.fromEntries(urlSearchParams.entries())
    const id = queryParams.id
    const team = queryParams.team

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
    
    const recoverAccountByTokenHandler = async (): Promise<void> => {
        if (!team || !id || !email || !emailPattern.test(email) || !password || !confPassword)
            return openAlertModalHandler("Faltan datos", "")
        if (password.length < 8)
            return openAlertModalHandler("La contraseña es demasiado corta (mín 8)", "")
        if (password !== confPassword)
            return openAlertModalHandler("La contraseña no coincide con su confirmación", "")
        const congr = parseInt(team)
        if (isNaN(congr))
            return openAlertModalHandler("Hay un error en los datos", "")
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
        if (!id || !team || email) return
        getEmailByEmailLink(team, id).then((email: string|null) => {
            if (!email) {
                dispatch(setValuesAndOpenAlertModalReducer({
                    mode: 'alert',
                    title: "El link no es válido",
                    message: "",
                    execution: () => navigate('/'),
                    animation: 2
                }))
                return
            }
            setEmail(email)
        })
    }, [dispatch, email, id, navigate, team])

    return (
        <Container className={isDarkMode ? 'bg-dark' : 'bg-white'}
            style={{
                border: '1px solid black',
                borderRadius: '12px',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                marginBottom: '50px',
                marginTop: '60px',
                maxWidth: '600px',
                padding: '50px 0 0'
            }}
        >
            
            <h2 className={`text-center mx-auto ${isDarkMode ? 'text-white' : ''}`}
                style={{
                    fontSize: isMobile ? '1.7rem' : '2rem',
                    maxWidth: '90%',
                    textShadow: '0 0 1px gray'
                }}
            >
                CAMBIAR LA CLAVE PARA RECUPERAR LA CUENTA
            </h2>

            <Container style={{ maxWidth: '500px', padding: isMobile ? '35px 30px 0' : '35px 0 0' }}>

                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={!email ? "Cargando..." : "Correo electrónico"}
                >
                    <Form.Control
                        type={'email'}
                        className={'form-control'}
                        autoComplete={'email'}
                        value={email}
                        onChange={() => {}}
                        disabled={true}
                    />
                </FloatingLabel>

                <FloatingLabel
                    label={"Nueva Contraseña"}
                    className={'mb-3 text-dark'}
                >
                    <Form.Control
                        className={'form-control'}
                        type={'password'}
                        value={password}
                        onChange={e => setPassword((e.target as HTMLInputElement).value)}
                        autoFocus
                    />
                </FloatingLabel>

                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={"Confirmar Nueva Contraseña"}
                >
                    <Form.Control
                        className={'form-control'}
                        type={'password'}
                        value={confPassword}
                        placeholder={"Confirmar Contraseña"}
                        onChange={e => setConfPassword((e.target as HTMLInputElement).value)}
                        onKeyDown={e => e.key === 'Enter' && !(!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword) ? recoverAccountByTokenHandler() : null }
                    />
                </FloatingLabel>

                <button
                    className={'btn btn-general-blue d-block w-100 mt-5'}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => recoverAccountByTokenHandler()}
                    disabled={!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword}
                >
                    CAMBIAR CLAVE
                </button>

                <button
                    className={`btn btn-general-red d-block w-100 mt-4 mb-5`}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => navigate('/')}
                >
                    Cancelar
                </button>

            </Container>
        </Container>
    )
}
