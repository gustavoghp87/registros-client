import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { FC } from 'react'
import { getFailingEmailFromLSService } from '../../services'
import { Link } from 'react-router-dom'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    acceptButtonLabel: string;
    action: Function;
    confPassword: string;
    email: string;
    group?: number;
    isRecovery: boolean;
    isRegister?: boolean;
    password: string;
    recoverAccountHandler?: Function;
    setConfPassword: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setGroup?: React.Dispatch<React.SetStateAction<number>>;
    setIsRegister?: React.Dispatch<React.SetStateAction<boolean>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    setTeam?: React.Dispatch<React.SetStateAction<number>>;
    team?: number;
    title: string;
}

export const FormLayout: FC<propsType> = ({
    acceptButtonLabel, action, confPassword, email, group, isRecovery, isRegister, password, recoverAccountHandler,
    setConfPassword, setEmail, setGroup, setIsRegister, setPassword, setTeam, team, title
}) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))

    const clearInputs = (): void => {
        if (isRegister) setEmail(getFailingEmailFromLSService() ?? "")
        else setEmail('')
        if (setIsRegister) setIsRegister(x => !x)
        setPassword('')
        setConfPassword('')
        if (setGroup) setGroup(0)
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
                        onChange={e => setEmail((e.target as HTMLInputElement).value)}
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
                        onChange={e => setPassword((e.target as HTMLInputElement).value)}
                        onKeyDown={e => e.key === 'Enter' && !isRegister && !isRecovery ? action() : null }
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
                            onChange={e => setConfPassword((e.target as HTMLInputElement).value)}
                            onKeyDown={e => e.key === 'Enter' ? action() : null }
                        />
                    </FloatingLabel>
                }

                {isRegister && setTeam && setGroup && <>
                    <FloatingLabel
                        label={"Número de Equipo de Trabajo"}
                        className={'mb-3 text-dark'}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'number'}
                            value={team ? team : ''}
                            min={'1'}
                            placeholder={"Número de Equipo de Trabajo"}
                            onChange={e => setTeam(parseInt(e.target.value))}
                            onKeyDown={e => e.key === 'Enter' ? action() : null }
                        />
                    </FloatingLabel>

                    <FloatingLabel
                        label={"Número de Grupo"}
                        className={'mb-3 text-dark'}
                    >
                        <Form.Control
                            className={'form-control'}
                            type={'number'}
                            value={group ? group : ''}
                            min={'1'}
                            placeholder={"Número de Grupo"}
                            onChange={e => setGroup(parseInt(e.target.value))}
                            onKeyDown={e => e.key === 'Enter' ? action() : null }
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
                        
                        {recoverAccountHandler &&
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
                        }
                    </>
                }

            </Container>
        </Container>
    )
}
