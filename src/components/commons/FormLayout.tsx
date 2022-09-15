import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getFailingEmailFromLSService } from '../../services'
import { typeRootState } from '../../models'

export const FormLayout = (props: any) => {

    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const action: Function = props.action
    const acceptButtonLabel: string = props.acceptButtonLabel
    const confPassword: string = props.confPassword
    const email: string = props.email
    const isRegister: boolean = props.isRegister
    const group: number = props.group
    const isRecovery: boolean = props.isRecovery
    const password: string = props.password
    const recoverAccountHandler: Function = props.recoverAccountHandler
    const setConfPassword: React.Dispatch<React.SetStateAction<string>> = props.setConfPassword
    const setEmail: React.Dispatch<React.SetStateAction<string>> = props.setEmail
    const setGroup: React.Dispatch<React.SetStateAction<number>> = props.setGroup
    const setIsRegister: React.Dispatch<React.SetStateAction<boolean>> = props.setIsRegister
    const setPassword: React.Dispatch<React.SetStateAction<string>> = props.setPassword
    const title: string = props.title

    const clearInputs = (): void => {
        if (isRegister) setEmail(getFailingEmailFromLSService() ?? "")
        else setEmail('')
        setIsRegister(x => !x)
        setPassword('')
        setConfPassword('')
        setGroup(0)
        if (email && isRegister) document.getElementById('passwordInput')?.focus()
        else document.getElementById('emailInput')?.focus()
    }

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
                {title}
            </h2>

            <Container style={{ maxWidth: '500px', padding: isMobile ? '35px 30px 0' : '35px 0 0' }}>

                <FloatingLabel
                    className={'mb-3 text-dark'}
                    label={isRecovery && !email ? "Cargando..." : "Correo electrónico"}
                >
                    <Form.Control
                        autoComplete={'email'}
                        className={'form-control'}
                        disabled={!!isRecovery}
                        id={"emailInput"}
                        onChange={(e: any) => setEmail((e.target as HTMLInputElement).value)}
                        placeholder={isRecovery ? "Cargando..." : "Correo electrónico"}
                        //style={{ backgroundColor: 'lightgray' }}
                        type={'email'}
                        value={email}
                    />
                </FloatingLabel>

                <FloatingLabel
                    label={isRecovery ? "Nueva Contraseña" : "Contraseña"}
                    className={'mb-3 text-dark'}
                >
                    <Form.Control
                        className={'form-control'}
                        id={"passwordInput"}
                        onChange={(e: any) => setPassword((e.target as HTMLInputElement).value)}
                        onKeyDown={(e: any) => e.key === 'Enter' && !isRegister && !isRecovery ? action() : null }
                        placeholder={"Contraseña"}
                        type={'password'}
                        value={password}
                    />
                </FloatingLabel>

                {(isRegister || isRecovery) &&

                    <FloatingLabel
                        className={'mb-3 text-dark'}
                        label={isRecovery ? "Confirmar Nueva Contraseña" : "Confirmar Contraseña"}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'password'}
                            value={confPassword}
                            placeholder={"Confirmar Contraseña"}
                            onChange={(e: any) => setConfPassword((e.target as HTMLInputElement).value)}
                            onKeyDown={(e: any) => e.key === 'Enter' ? action() : null }
                        />
                    </FloatingLabel>
                }

                {isRegister && <>
                    <FloatingLabel
                        label={"Número de Grupo de Predicación"}
                        className={'mb-3 text-dark'}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'number'}
                            value={group ? group : ''}
                            min={'1'}
                            placeholder={"Número de Grupo de Predicación"}
                            onChange={(e: any) => setGroup((e.target as any).value)}
                            onKeyDown={(e: any) => e.key === 'Enter' ? action() : null }
                        />
                    </FloatingLabel>
                </>}

                <button
                    className={`btn ${(isRegister || isRecovery) ? 'btn-general-red' : 'btn-general-blue'} d-block w-100 mt-3`}
                    style={{ fontWeight: 'bolder', height: '50px' }}
                    onClick={() => action()}
                >
                    {acceptButtonLabel}
                </button>

                {isRecovery ?
                    <Link to={'/acceso'}>
                        <p style={{ fontSize: '1.1rem', margin: '15px 0 20px 0', textAlign: 'end' }}>
                            Cancelar
                        </p>
                    </Link>
                    :
                    <>
                        <p className={'text-end'}
                            style={{
                                color: '#0000cd',
                                fontSize: '1rem',
                                margin: '18px 0 10px 0',
                                textDecoration: 'underline'
                            }}
                        >
                            <span className={'pointer'} onClick={() => clearInputs()}>
                                {isRegister ? "Volver a ingreso" : "Registrar una cuenta"}
                            </span>
                        </p>
                        
                        <p className={'text-end'}
                            style={{
                                color: '#0000cd',
                                fontSize: '1rem',
                                margin: '0 0 22px',
                                textDecoration: 'underline'
                            }}
                        >
                            <span className={'pointer'} onClick={() => recoverAccountHandler()}>
                                Olvidé mi contraseña
                            </span>
                        </p>
                    </>
                }

            </Container>
        </Container>
    )
}
