import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { emailPattern } from '../../app-config'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'
import { registerUserService } from '../../services/userServices'
import { typeRootState } from '../../models'
import { useDispatch, useSelector } from 'react-redux'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'

export const NewUserPage = () => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const { executeRecaptcha } = useGoogleReCaptcha()
    const [params] = useSearchParams();
    const id = params.get('id') || ""
    const email = params.get('email') || ""
    const team = params.get('team') || "0"

    const [confPassword, setConfPassword] = useState("")
    const [group, setGroup] = useState(0)
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const openAlertModalHandler = (title: string, message: string, animation?: number, execution?: Function): void => {
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title,
            message,
            animation,
            execution
        }))
    }

    const createAccountByEmailInvitationHandler = async () => {
        if (!id || !emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group)
            return openAlertModalHandler("Faltan datos", "")
        const congr = parseInt(team)
        if (isNaN(congr) || !Number.isInteger(congr))
            return openAlertModalHandler("Hay un error en los datos", "")
        if (!executeRecaptcha)
            return
        const recaptchaToken: string = await executeRecaptcha()
        if (!recaptchaToken)
            return openAlertModalHandler("Problemas (1)", "Refrescar la página", 2)
        dispatch(showLoadingModalReducer())
        const response = await registerUserService(email, group, id, password, recaptchaToken, group)
        dispatch(hideLoadingModalReducer())
        if (response?.success) {
            openAlertModalHandler("Usuario creado con éxito", "", 1, () => navigate('/'))
            return
        }
        if (response?.recaptchaFails) {
            openAlertModalHandler("Algo falló en la página; se va a refrescar", "", 2, () => window.location.reload())
        } else if (response?.userExists) {
            openAlertModalHandler("Ya hay una cuenta con esta dirección de email", "", 2, () => navigate('/acceso'))
        } else if (response?.expired) {
            openAlertModalHandler("Esta invitación ya expiró; pedir otra", "", 2, () => navigate('/'))
        } else {
            openAlertModalHandler("Algo salió mal", "", 2)
        }
    }

    return (
        <Container className={'maxw-400'}>

            <h2 className={`text-center mt-5 mx-auto ${isDarkMode ? 'text-white' : ''}`}
                style={{
                    fontSize: isMobile ? '1.7rem' : '2rem',
                    maxWidth: '90%',
                    textShadow: '0 0 1px gray'
                }}
            >
                COMPLETAR PARA CREAR UN USUARIO
            </h2>

            <Container style={{ maxWidth: '500px', padding: isMobile ? '35px 30px 0' : '35px 0 0' }}>

                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={"Correo electrónico"}
                >
                    <Form.Control
                        type={'email'}
                        className={'form-control'}
                        placeholder={""}
                        value={email}
                        onChange={() => {}}
                        disabled={true}
                    />
                </FloatingLabel>

                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={"Nueva Contraseña"}
                >
                    <Form.Control
                        type={'password'}
                        className={'form-control'}
                        placeholder={""}
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
                        type={'password'}
                        className={'form-control'}
                        placeholder={""}
                        value={confPassword}
                        onChange={e => setConfPassword((e.target as HTMLInputElement).value)}
                    />
                </FloatingLabel>

                <FloatingLabel
                    label={"Número de Grupo"}
                    className={'mb-3 text-dark'}
                >
                    <Form.Control
                        type={'number'}
                        className={'form-control'}
                        placeholder={""}
                        value={group ? group : ''}
                        min={'1'}
                        onChange={e => setGroup(parseInt(e.target.value))}
                        onKeyDown={e => e.key === 'Enter' && !(!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group) ? createAccountByEmailInvitationHandler() : null }
                    />
                </FloatingLabel>

                <button
                    className={'btn btn-general-blue d-block w-100 mt-5'}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => createAccountByEmailInvitationHandler()}
                    disabled={!emailPattern.test(email) || password.length < 8 || confPassword.length < 8 || password !== confPassword || !group}
                >
                    CREAR USUARIO
                </button>

                <button
                    className={`btn btn-general-red d-block w-100 mt-4 mb-5`}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => navigate('/')}
                >
                    CANCELAR
                </button>

            </Container>
        </Container>
    )
}
