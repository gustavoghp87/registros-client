import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { setValuesAndOpenAlertModalReducer } from '../store/AlertModalSlice'
import { changePswService, getEmailByEmailLink } from '../services'
import { typeAppDispatch, typeRootState } from '../models'

export const RecoveryPage = () => {

    const { id } = useParams<string>()
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const dispatch: typeAppDispatch = useDispatch<typeAppDispatch>()
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
    
    const sendFormHandler = async (): Promise<void> => {
        if (!id || !email || !password || !confPassword) return openAlertModalHandler("Faltan datos", "")
        if (password.length < 8) return openAlertModalHandler("La contraseña es demasiado corta (mín 8)", "")
        if (password !== confPassword) return openAlertModalHandler("La contraseña no coincide con su confirmación", "")
        const response = await changePswService(null, password, id)
        if (response && response.success) {
            openAlertModalHandler("Clave cambiada con éxito", "", () => window.location.href = '/')
        } else if (response && response.expired) {
            openAlertModalHandler("Este link ya expiró; pedir otro", "", () => window.location.href = '/acceso')
        } else if (response && response.used) {
            openAlertModalHandler("Este link de recuperación ya se usó antes", "", () => window.location.href = '/acceso')
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
                    execution: () => window.location.href = '/'
                }))
            }
        })
    }, [id, email, dispatch])

    return (
        <Container
            style={{ maxWidth: '95%', marginTop: '50px', padding: '0' }}>

            <Container className={isDarkMode ? 'bg-dark text-white' : ''}
                style={{
                    border: 'gray 1px solid',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                    marginBottom: '40px',
                    maxWidth: '600px',
                    paddingTop: '40px'
                }}
            >

                <h2
                    style={{
                        fontSize: isMobile ? '1.6rem' : '2rem',
                        marginInline: '10px',
                        textAlign: 'center',
                        textShadow: '0 0 1px gray'
                    }}
                >
                    CAMBIAR LA CLAVE PARA RECUPERAR LA CUENTA
                </h2>

                <Container style={{ paddingTop: '35px', maxWidth: '500px' }}>

                    <input className={'form-control'}
                        type={'email'}
                        style={{ marginBottom: '12px' }}
                        placeholder={"Cargando..."}
                        value={email}
                        readOnly
                    />

                    <input className={'form-control'}
                        type={'password'}
                        style={{ marginBottom: '12px' }}
                        placeholder={"Nueva Contraseña"}
                        autoFocus
                        onChange={(e: any) => setPassword((e.target as HTMLInputElement).value)}
                    />

                    <input className={'form-control'}
                        type={'password'}
                        style={{ marginBottom: '26px' }}
                        placeholder={"Confirmar Contraseña Nueva"}
                        onChange={(e: any) => setConfPassword((e.target as HTMLInputElement).value)}
                    />

                    <button className={'btn btn-danger'}
                        style={{ width: '100%', height: '50px' }}
                        onClick={() => sendFormHandler()}
                    >
                        CAMBIAR CLAVE
                    </button>

                    <Link to={'/acceso'}>
                        <p style={{ fontSize: '1.1rem', margin: '15px 0 20px 0', textAlign: 'end' }}>
                            Cancelar
                        </p>
                    </Link>

                </Container>
            </Container>
        </Container>
    )
}
