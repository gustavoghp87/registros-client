import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { typeRootState } from '../../models'
import { setGoogleBoardUrlService } from '../../services/configServices'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../store'

type propsType = {
    setShowSetGoogleBoardUrl: Dispatch<SetStateAction<boolean>>
}

export const ConfigSetGoogleBoardUrl: FC<propsType> = ({ setShowSetGoogleBoardUrl }) => {
    const config = useSelector((state: typeRootState) => state.config)
    const [url, setUrl] = useState(config.googleBoardUrl)
    const dispatch = useDispatch()

    const setGoogleSiteUrlHandler = async () => {
        if (!url || !url.includes('sites.google.com')) return
        dispatch(showLoadingModalReducer())
        const success: boolean = await setGoogleBoardUrlService(url)
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
        <Container style={{ maxWidth: '400px' }}>
            <FloatingLabel
                className={'mb-3 text-dark'}
                label={"Dirección del tablero en Google"}
            >
                <Form.Control
                    className={'form-control'}
                    type={'text'}
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' ? setGoogleSiteUrlHandler() : null }
                    autoFocus
                />
            </FloatingLabel>

            <span> El formato tiene que ser https://sites.google.com/view/algo-mas </span>

            <button
                className={`btn btn-general-blue d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={setGoogleSiteUrlHandler}
                disabled={!url || url.length < 6 || !url.includes('sites.google.com')}
            >
                Aceptar
            </button>

            <button
                className={`btn btn-general-red d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={() => setShowSetGoogleBoardUrl(false)}
            >
                Cancelar
            </button>
        </Container>
    )
}