import { Card, Form, FloatingLabel } from 'react-bootstrap'
import { changePswService } from '../../services'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { typeRootState } from '../../models'
import { useSelector } from 'react-redux'

type propsType = {
    openAlertModalHandler: (title: string, message: string, animation?: number) => void
    openConfirmModalHandler: (title: string, message: string, execution: Function) => void
    setShowChangePsw: Dispatch<SetStateAction<boolean>>
}

export const UserChangePassword: FC<propsType> = ({ openAlertModalHandler, openConfirmModalHandler, setShowChangePsw }) => {
    const { isDarkMode, user } = useSelector((state: typeRootState) => ({
        isDarkMode: state.darkMode.isDarkMode,
        user: state.user
    }))
    const [newPsw, setNewPsw] = useState("")
    const [psw, setPsw] = useState("")

    const changePsw = async (): Promise<void> => {
        const response = await changePswService(user.congregation, psw, newPsw, null)
        if (response && response.newToken) {
            openAlertModalHandler("Clave cambiada con éxito", "", 1)
            setShowChangePsw(false)
        } else if (response && response.wrongPassword) {
            openAlertModalHandler("Clave incorrecta", "", 2)
        } else {
            openAlertModalHandler("Algo falló", "", 2)
        }
    }

    const changePswHandler = () => openConfirmModalHandler("Atención", `Se cambiará la contraseña de ${psw} a ${newPsw}`, () => {
        if (!psw || !newPsw || psw.length < 8)
            return openAlertModalHandler("Completar los campos primero", "", 2)
        if (newPsw.length < 8)
            return openAlertModalHandler("La clave debe tener al menos 8 caracteres", "", 2)
        changePsw()
    })

    return (
        <>
            <Card className={isDarkMode ? 'bg-dark text-white' : ''}
                style={{ margin: '60px auto', maxWidth: '450px', padding: '25px' }}
            >

                <Card.Title className={'text-center mb-4'}> CAMBIAR LA CONTRASEÑA </Card.Title>

                <Form.Group>
                    <FloatingLabel
                        label={"Contraseña actual"}
                        className={'mb-3 text-secondary'}
                    >
                        <Form.Control type={'text'}
                            placeholder={""}
                            value={psw}
                            onChange={e => setPsw(e.target.value)}
                            autoFocus
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group>
                    <FloatingLabel
                        label={"Nueva contraseña"}
                        className={'mb-3 text-secondary'}
                    >
                        <Form.Control type={'text'}
                            placeholder={""}
                            value={newPsw}
                            onChange={e => setNewPsw(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' ? changePswHandler() : null }
                        />
                    </FloatingLabel>
                </Form.Group>

                <button className={'btn btn-general-blue my-2'} onClick={changePswHandler}>
                    Aceptar
                </button>

                <button className={'btn btn-general-red'} onClick={() => setShowChangePsw(false)}>
                    Cancelar
                </button>

            </Card>
        </>
    )
}
