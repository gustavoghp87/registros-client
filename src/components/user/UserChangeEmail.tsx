import { Card, Form, FloatingLabel } from 'react-bootstrap'
import { changeEmailService } from '../../services/userServices'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { emailPattern } from '../../app-config'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    openAlertModalHandler: (title: string, message: string, animation?: number) => void
    openConfirmModalHandler: (title: string, message: string, execution: Function) => void
    setShowChangeEmail: Dispatch<SetStateAction<boolean>>
}

export const UserChangeEmail: FC<propsType> = ({ openAlertModalHandler, openConfirmModalHandler, setShowChangeEmail }) => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [newEmail, setNewEmail] = useState("")

    const changeEmail = async (): Promise<void> => {
        if (!newEmail || !emailPattern.test(newEmail))
            return
        const response = await changeEmailService(newEmail)
        if (!!response?.success) {
            openAlertModalHandler("Clave cambiada con éxito", "", 1)
            window.location.reload()
        } else if (response && response.wrongPassword) {
            openAlertModalHandler("Clave incorrecta", "", 2)
        } else {
            openAlertModalHandler("Algo falló", "", 2)
        }
    }

    const changeEmailHandler = async (): Promise<void> => {
        if (newEmail.length < 6)
            return openAlertModalHandler("La dirección no tiene formato de dirección de correo electrónico", "")
        openConfirmModalHandler(
            "Se va a cambiar la dirección de correo electrónico",
            `Pasará de ser ${user.email} a ${newEmail}. Recordar que esta dirección de Email va a ser también el 'username' para ingresar a la aplicación`,
            changeEmail
        )
    }

    return (
        <>
            <Card className={isDarkMode ? 'bg-dark text-white' : ''}
                style={{ margin: '60px auto', maxWidth: '450px', padding: '25px' }}
            >

                <Card.Title className={'text-center mb-4'}> CAMBIAR LA DIRECCIÓN DE EMAIL </Card.Title>

                <Form.Group>
                    <FloatingLabel
                        label={"Dirección de Email actual"}
                        className={'mb-3 text-secondary'}
                    >
                        <Form.Control type={'text'}
                            autoFocus
                            onChange={e => setNewEmail(e.target.value)}
                            placeholder={"Dirección actual"}
                            value={user.email}
                            disabled
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group>
                    <FloatingLabel
                        label={"Nueva dirección de Email"}
                        className={'mb-3 text-secondary'}
                    >
                        <Form.Control type={'text'}
                            placeholder={"Nueva dirección"}
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' ? changeEmailHandler() : null }
                            autoFocus
                        />
                    </FloatingLabel>
                </Form.Group>

                <span className={'text-center my-2'}>
                    Esta dirección de Email va a ser también el 'username' para ingresar a la aplicación
                </span>

                <button className={'btn btn-general-blue my-2'}
                    onClick={changeEmailHandler}
                    disabled={!newEmail || !emailPattern.test(newEmail)}
                >
                    Aceptar
                </button>

                <button className={'btn btn-general-red'} onClick={() => setShowChangeEmail(false)}>
                    Cancelar
                </button>

            </Card>
        </>
    )
}
