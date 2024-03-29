import { Container, FloatingLabel, Form } from 'react-bootstrap'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { hideLoadingModalReducer, setValuesAndOpenAlertModalReducer, showLoadingModalReducer } from '../../../store'
import { setGoogleBoardUrlService } from '../../../services'
import { typeRootState } from '../../../models'
import { useDispatch, useSelector } from 'react-redux'

type propsType = {
    setShowSetGoogleBoardUrl: Dispatch<SetStateAction<boolean>>
}

export const ConfigSetGoogleBoardUrl: FC<propsType> = ({ setShowSetGoogleBoardUrl }) => {
    const { config, isDarkMode } = useSelector((state: typeRootState) => ({
        config: state.config,
        isDarkMode: state.darkMode.isDarkMode
    }))
    const [url, setUrl] = useState(`https://sites.google.com${config.googleBoardUrl}`)
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
        <Container className={'maxw-400'}>
            <FloatingLabel
                className={'mb-3 text-dark'}
                label={"Dirección del tablero en Google"}
            >
                <Form.Control
                    type={'text'}
                    className={'form-control'}
                    placeholder={""}
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' ? setGoogleSiteUrlHandler() : null }
                    autoFocus
                />
            </FloatingLabel>

            <span className={isDarkMode ? 'text-white' : ''}>
                El formato tiene que ser https://sites.google.com/view/algo-mas
            </span>

            <button
                className={`btn btn-general-blue d-block w-100 mt-3`}
                style={{ fontWeight: 'bolder', height: '50px' }}
                onClick={setGoogleSiteUrlHandler}
                disabled={!url || url.length < 6 || !url.includes('sites.google.com') || url === `https://sites.google.com${config.googleBoardUrl}`}
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