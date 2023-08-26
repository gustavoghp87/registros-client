import { BsArrowBarDown } from 'react-icons/bs'
import { ButtonGroup, Container, FloatingLabel, Form, ToggleButton } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { emailPattern } from '../../../app-config'
import { generalBlue } from '../../../constants'
import { inviteNewUserService } from '../../../services/configServices'
import { setValuesAndOpenAlertModalReducer } from '../../../store'
import { typeRootState } from '../../../models'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const radios = [
    { name: 'Invitar', value: '1' },
    { name: 'Crear', value: '2' }
]

type propsType = {
    setIsLoading: Dispatch<SetStateAction<boolean>>
    setShowNewUser: Dispatch<SetStateAction<boolean>>
    showNewUser: boolean
}

export const UsersInvite: FC<propsType> = ({ setIsLoading, setShowNewUser, showNewUser }) => {
    const { isDarkMode, isMobile } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        isMobile: state.mobileMode.isMobile
    }))
    const [email, setEmail] = useState("")
    const [radioValue, setRadioValue] = useState('1');
    const dispatch = useDispatch()

    console.log(radioValue);
    

    const inviteNewUserHandler = async () => {
        if (!email || !emailPattern.test(email)) return
        setIsLoading(true)
        const success: boolean = await inviteNewUserService(email)
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Error",
                message: `No se pudo invitar a ${email}. Mirar los logs.`,
                animation: 2
            }))
            return
        }
        dispatch(setValuesAndOpenAlertModalReducer({
            mode: 'alert',
            title: "Logrado",
            message: `Se invitó a ${email}`,
            animation: 1
        }))
    }

    return (<>
        <button className={'btn btn-general-blue btn-size12 d-block mx-auto mt-5 mb-3'}
            style={{ width: '350px', minHeight: '60px' }}
            onClick={() => setShowNewUser(true)}
            disabled={showNewUser}
        >
            NUEVO USUARIO <BsArrowBarDown size={isMobile ? '2rem' : '1.4rem'} />
        </button>

        {showNewUser &&
            <Container className={'mt-4'} style={{ maxWidth: '400px' }}>

                <ButtonGroup className={'w-100 mt-3 mb-2'}>
                    {radios.map((radio, idx) => (
                        <ToggleButton key={idx}
                            id={`radio-${idx}`}
                            type={'radio'}
                            className={radioValue == radio.value ? '' : 'bg-secondary'}
                            style={{ backgroundColor: radioValue == radio.value ? generalBlue : undefined }}
                            checked={radioValue == radio.value}
                            value={radio.value}
                            onChange={e => setRadioValue(e.currentTarget.value)}
                        >
                            {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>

                {radioValue === '1' ?
                    <>
                        <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
                            Enviarle por Email un acceso para que se cree una cuenta
                        </h3>
                        <FloatingLabel
                            className={'mt-5 mb-3 text-dark'}
                            label={"Dirección de email"}
                        >
                            <Form.Control
                                className={'form-control'}
                                type={'email'}
                                value={email}
                                onChange={e => setEmail((e.target as HTMLInputElement).value)}
                                onKeyDown={e => e.key === 'Enter' ? inviteNewUserHandler() : null }
                                autoFocus
                            />
                        </FloatingLabel>

                        <button
                            className={`btn btn-general-blue d-block w-100 mt-3`}
                            style={{ fontWeight: 'bolder', height: '50px' }}
                            onClick={inviteNewUserHandler}
                            // disabled={!email || !emailPattern.test(email)}
                            disabled={true}
                        >
                            Aceptar
                        </button>

                        <button
                            className={`btn btn-general-red d-block w-100 mt-3`}
                            style={{ fontWeight: 'bolder', height: '50px' }}
                            onClick={() => setShowNewUser(false)}
                        >
                            Cancelar
                        </button>
                    </>
                    :
                    <>
                        <h3 className={`text-center mt-5 ${isDarkMode ? 'text-white' : ''}`}>
                            Crear una cuenta
                        </h3>

                        {/* <FormLayout
                            action={registerHandler}
                            acceptButtonLabel={"REGISTRAR"}
                            email={email}
                            confPassword={confPassword}
                            group={group}
                            isRegister={true}
                            password={password}
                            recoverAccountHandler={recoverAccountHandler}
                            setConfPassword={setConfPassword}
                            setEmail={setEmail}
                            setTeam={setTeam}
                            setGroup={setGroup}
                            setIsRegister={setIsRegister}
                            setPassword={setPassword}
                            team={team}
                            isRecovery={false}
                            title={isRegister ? "REGISTRARSE" : "INGRESAR"}
                        /> */}
                    </>
                }

                
            </Container>
        }
    </>)
}
