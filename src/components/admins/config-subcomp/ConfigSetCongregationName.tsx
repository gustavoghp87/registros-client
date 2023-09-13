import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../../store'
import { setCongregationNameService } from '../../../services'
import { typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    setShowSetCongregationName: Dispatch<SetStateAction<boolean>>
}

export const ConfigSetCongregationName: FC<propsType> = ({ setShowSetCongregationName }) => {
    const config = useSelector((state: typeRootState) => state.config)
    const [name, setName] = useState(config.name)
    const dispatch = useDispatch()

    const setCongregationNameHandler = async () => {
        if (!name) return
        dispatch(showLoadingModalReducer())
        const success: boolean = await setCongregationNameService(name)
        dispatch(hideLoadingModalReducer())
        if (!success) {
            dispatch(setValuesAndOpenAlertModalReducer({
                mode: 'alert',
                title: "Algo falló",
                message: "Mirar los logs",
                animation: 2
            }))
            return
        }
        window.location.reload()
    }

    return (
        <Container className={'maxw-400'}>
            <FloatingLabel
                className={'mb-3 text-dark'}
                label={"Nombre de la Congregación"}
            >
                <Form.Control
                    type={'text'}
                    className={'form-control'}
                    placeholder={""}
                    value={name ? name : ''}
                    onChange={e => setName( e.target.value)}
                    onKeyDown={e => e.key === 'Enter' ? setCongregationNameHandler() : null }
                    autoFocus
                />
            </FloatingLabel>

            <button
                className={`btn btn-general-blue d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={setCongregationNameHandler}
                disabled={!name || name.length < 6}
            >
                Aceptar
            </button>

            <button
                className={`btn btn-general-red d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={() => setShowSetCongregationName(false)}
            >
                Cancelar
            </button>
        </Container>
    )
}
